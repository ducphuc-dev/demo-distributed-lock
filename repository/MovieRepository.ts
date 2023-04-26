import { MovieInterface } from "../model/interface/MovieInterface";
import MovieModel from "../model/MovieModel";
import { BaseRepository } from "./BaseRepository";

export class MovieRepo extends BaseRepository<MovieInterface> {
    private static instance: MovieRepo;

    private constructor() {
        super();
        this.model = MovieModel;
    }

    public static getInstance(): MovieRepo {
        if (!MovieRepo.instance) {
            MovieRepo.instance = new MovieRepo();
        }

        return MovieRepo.instance;
    }
}