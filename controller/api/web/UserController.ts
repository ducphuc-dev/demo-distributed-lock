import { executeError } from "../../../base/excuteError";
import { UserRepo } from "../../../repository/UserRepository";
import { MovieRepo } from "../../../repository/MovieRepository";
import { buyMultyTicketWithDistributedLock, buyTicket, buyTicketWithDistributedLock } from "../../../services/UserService";
import responseCode from "../../../base/responseCode";

const userRepo = UserRepo.getInstance();
const movieRepo = MovieRepo.getInstance();

export const createUser = async (req: any, res: any, next: any) => {
    try {
        const user = await userRepo.create(req.body)
        res.success(user);
    } catch (error:any) {
        error = executeError(error);
        res.error(error.name, error.message, error.statusCode);
    }
};

export const createMovie = async (req: any, res: any, next: any) => {
    try {
        const { movies } = req.body
        const promises = movies.map(async (movie) => {
            movie.showtimes.forEach(showtime => {
                const tickets:Array<any> = [];
                ["A", "B", "C", "D"].forEach(row => {
                    ["1", "2", "3", "4", "5"].forEach(number => {
                        tickets.push({
                            ticket_id: `${row}${number}`,
                            status: "empty",
                            user_id: null,
                            ordered_at: null
                        })
                    })
                })
                showtime.tickets = tickets
            })
            const movieRecord = await movieRepo.create(movie)
            console.log("movieRecord: ", movieRecord)
            return movie
        })
        await Promise.all(promises)
        res.success();
    } catch (error:any) {
        error = executeError(error);
        res.error(error.name, error.message, error.statusCode);
    }
};

export const userBuyTicket = async (req, res) => {
    const { user_id, movie_id, showtime_id, ticket_id } = req.body
    try {
        // const userTicket = await buyTicket(movie_id, showtime_id, ticket_id, user_id)
        const userTicket = await buyTicketWithDistributedLock(movie_id, showtime_id, ticket_id, user_id)
        res.success(userTicket)
    } catch (error:any) {
        res.error(responseCode.SERVER.name, error.message, responseCode.SERVER.code)
    }
}