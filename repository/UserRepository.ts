import { UserInterface } from "../model/interface/UserInterface";
import UserModel from "../model/UserModel";
import { BaseRepository } from "./BaseRepository";

export class UserRepo extends BaseRepository<UserInterface> {
    private static instance: UserRepo;

    private constructor() {
        super();
        this.model = UserModel;
    }

    public static getInstance(): UserRepo {
        if (!UserRepo.instance) {
            UserRepo.instance = new UserRepo();
        }

        return UserRepo.instance;
    }
}