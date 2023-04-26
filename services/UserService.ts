import { ObjectId } from "mongodb";
import { acquireLock, getAsync, incrAsync, releaseLock, unwatchResource, watchResource } from "../base/connection/redis";
import { MovieRepo } from "../repository/MovieRepository";

const movieRepo = MovieRepo.getInstance()
const MAX_RETRIES = 5

export const buyTicket = async (movieId: string, showtimeId: string, ticketId: number, userId: string) => {
	const movie = await movieRepo.findById(movieId);
	if (!movie) {
		throw new Error("Movie not found")
	}
	let showTime = movie.showtimes.find(item => item._id.toString() === showtimeId)
	if (!showTime) {
		throw new Error("Showtime not found")
	}
	let ticket = showTime.tickets.find(item => item.ticket_id === ticketId)
	if (!ticket) {
		throw new Error("Invalid ticket")
	}
	if (ticket.status === "ordered") {
		throw new Error("This ticket is ordered by another one")
	}

	// all valid, perform action
	const showTimeIndex = movie.showtimes.indexOf(showTime)
	const ticketIndex = showTime.tickets.indexOf(ticket)
	console.log("ticketIndex: ", ticketIndex)
	ticket.status = "ordered"
	ticket.user_id = new ObjectId(userId)
	ticket.ordered_at = new Date()
	const showtimeItem = {
		...showTime,
		tickets: [
			...showTime.tickets.slice(0, ticketIndex),
			ticket,
			...showTime.tickets.slice(ticketIndex + 1)
		]
	}
	const updatedShowtimes = [
		...movie.showtimes.slice(0, showTimeIndex),
		showtimeItem,
		...movie.showtimes.slice(showTimeIndex)
	]

	// return {}
	const userTicket = await movieRepo.update(movieId, {
		showtimes: updatedShowtimes
	})
	console.log("Updated successfully")

	return userTicket
}

/**
 * Pessimistic locking
 * @param movieId 
 * @param showtimeId 
 * @param ticketId 
 * @param userId 
 * @returns 
 */



export const buyTicketWithDistributedLock = async (movieId: string, showtimeId: string, ticketId: number, userId: string) => {
	const resource = `movie:${movieId}:ticket:${ticketId}`;
	const lock = await acquireLock(resource);
	// check if the lock was acquired successfully
	if (lock) {
		// find movie and showtime
		const movie = await movieRepo.findById(movieId);
		if (!movie) {
			console.log("xxxxx")
			await releaseLock(lock)
			throw new Error("Movie not found")
		}
		const showTime = movie.showtimes.find(item => item._id.toString() === showtimeId)
		if (!showTime) {
			console.log("xxxxx2")
			await releaseLock(lock)
			throw new Error("Showtime not found")
		}
		const ticket = showTime.tickets.find(item => item.ticket_id === ticketId)
		if (!ticket) {
			console.log("xxxxx3")
			await releaseLock(lock)
			throw new Error("Invalid ticket")
		}
		if (ticket.status === "ordered") {
			console.log("xxxxx4")
			await releaseLock(lock)
			throw new Error("This ticket is ordered by another one")
		}

		// all valid, perform action
		const showTimeIndex = movie.showtimes.indexOf(showTime)
		const ticketIndex = showTime.tickets.indexOf(ticket)
		ticket.status = "ordered"
		ticket.user_id = new ObjectId(userId)
		ticket.ordered_at = new Date()
		const showtimeItem = {
			...showTime,
			tickets: [
				...showTime.tickets.slice(0, ticketIndex),
				ticket,
				...showTime.tickets.slice(ticketIndex + 1)
			]
		}
		const updatedShowtimes = [
			...movie.showtimes.slice(0, showTimeIndex),
			showtimeItem,
			...movie.showtimes.slice(showTimeIndex)
		]

		// return {}
		const userTicket = await movieRepo.update(movieId, {
			showtimes: updatedShowtimes
		})
		console.log("Updated successfully")

		// unlock the lock when the operation is done
		await releaseLock(lock)
		return userTicket
	} else {
		throw new Error("The operation is inprogress") // Should use 429 Too Many Requests
	}
}


export const buyMultyTicketWithDistributedLock = async (movieId: string, showtimeId: string, ticketIds: Array<string>, userId: string) => {
	const resourceLocked = await Promise.all(ticketIds.map(async (ticketId) => {
		try {
			const resource = `movie:${movieId}:ticket:${ticketId}`;
			const lock = await acquireLock(resource);
			return lock
		} catch (error) {
			return null
		}
	}))
	// console.log("resourceLocked: ", resourceLocked)

	// check if the lock was acquired successfully
	if (resourceLocked.length) {
		// find movie and showtime
		const movie = await movieRepo.findById(movieId);
		if (!movie) {
			resourceLocked.map(lock => releaseLock(lock))
			throw new Error("Movie not found")
		}
		const showTime = movie.showtimes.find(item => item._id.toString() === showtimeId)
		if (!showTime) {
			resourceLocked.map(lock => releaseLock(lock))
			throw new Error("Showtime not found")
		}
		const showTimeIndex = movie.showtimes.indexOf(showTime)
		let showtimeItem = { ...showTime }
		for (let i = 0; i < ticketIds.length; i++) {
			const ticketId = ticketIds[i]
			const ticket = showTime.tickets.find(item => item.ticket_id === ticketId)
			if (!ticket) {
				resourceLocked.map(lock => releaseLock(lock))
				throw new Error("Invalid ticket")
			}
			if (ticket.status === "ordered") {
				resourceLocked.map(lock => releaseLock(lock))
				throw new Error("This ticket is ordered by another one")
			}

			// all valid, perform action
			const ticketIndex = showTime.tickets.indexOf(ticket)
			ticket.status = "ordered"
			ticket.user_id = new ObjectId(userId)
			ticket.ordered_at = new Date()
			showtimeItem = {
				...showtimeItem,
				tickets: [
					...showtimeItem.tickets.slice(0, ticketIndex),
					ticket,
					...showtimeItem.tickets.slice(ticketIndex + 1)
				]
			}
		}


		const updatedShowtimes = [
			...movie.showtimes.slice(0, showTimeIndex),
			showtimeItem,
			...movie.showtimes.slice(showTimeIndex)
		]

		const userTicket = await movieRepo.update(movieId, {
			showtimes: updatedShowtimes
		})
		console.log("Updated successfully")

		// unlock the lock when the operation is done
		resourceLocked.map(lock => releaseLock(lock))
		return userTicket
	} else {
		throw new Error("The operation is inprogress") // Should use 429 Too Many Requests
	}
}

