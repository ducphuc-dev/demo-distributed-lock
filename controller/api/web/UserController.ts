import { executeError } from "../../../base/excuteError";
import { UserRepo } from "../../../repository/UserRepository";

const userRepo = UserRepo.getInstance();

export const createUser = async (req: any, res: any, next: any) => {
    try {
        console.log('Success hihi: ', req.body);
        
        const user = await userRepo.create(req.body)
        res.success(user);
    } catch (error) {
        error = executeError(error);
        res.error(error.name, error.message, error.statusCode);
    }
};