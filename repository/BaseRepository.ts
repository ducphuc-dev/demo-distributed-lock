// interface write and Read DB
import { NotFoundError, QueryDBError } from '../base/customError';
import { IWrite, IRead } from './interface/interfaceGlobalRepository';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
    protected model;
    //we created constructor with arguments to manipulate mongodb operations

    setModel(model) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    find(item: any): Promise<T[]> {
        const result = this.model.find(item);
        return result;
    }

    populate(relat: string): Promise<T[]> {
        const result = this.model.populate(relat);
        return result;
    }

    findOne(item: any): Promise<T[]> {
        const result = this.model.findOne(item);
        return result;
    }

    findOneAndUpdate(filter: any, item: any): Promise<T[]> {
        const result = this.model.findOneAndUpdate(filter, item, {
            new: true,
        });
        return result;
    }

    async findById(id: string) {
        try {
            const result = await this.model.findById(ObjectId(id));
            return result;
        } catch (error) {
            return null;
        }
    }

    async findOrFail(item: any) {
        try {
            const result = await this.findOne(item);
            if (!result) {
                throw new NotFoundError('Database Error: Không tìm thấy');
            }
            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            } else {
                throw new QueryDBError(error.message);
            }
        }
    }

    async create(item: any): Promise<T> {
        const result = await this.model.create(item);
        return result;
    }

    /**
     *
     * @param item to write DB
     * @param findItem  to find DB from filter findItem
     * if findItem = null then find by _id in item
     */
    async createOrUpdate(item: any, findItem: any = null): Promise<T> {
        let checkExist = await this.findById(item._id);
        if (findItem) {
            checkExist = await this.findOne(findItem);
        }
        let objSchema: any = null;
        if (checkExist) {
            objSchema = await this.update(checkExist._id, item);
        } else {
            try {
                if (!item._id) delete item._id;
                objSchema = await this.create(item);
            } catch (error) {
                delete item._id;
                objSchema = await this.create(item);
            }
        }
        return objSchema;
    }

    async update(id: string, item: any): Promise<T> {
        const model = await this.findById(id);
        if (!model) {
            throw new NotFoundError('Database Error: Không tìm thấy');
        }
        const objSchema = await this.model.findByIdAndUpdate(id, item, {
            new: true
        });
        return objSchema;
    }

    async delete(id: string): Promise<boolean> {
        const model = await this.findById(id);
        if (!model) {
            throw new NotFoundError('Database Error: Không tìm thấy');
        }
        const objSchema = await this.model.findByIdAndDelete(id);
        return objSchema;
    }

    deleteMany(item: any) {
        return this.model.find(item).deleteMany();
    }

    deleteManyByID(ids) {
        return this.model.deleteMany({
            _id: { $in: ids },
        });
    }

    async count(filter = {}) {
        return this.model.find(filter).count();
    }

    async insertMany(items: any): Promise<T> {
        const result = await this.model.insertMany(items);
        return result;
    }

}

export class BaseQueryHelper {
    public static fieldSearch = (keyword, fieldName) => {
        const keywordMatch = [
            {
                [fieldName]: { $regex: `${keyword}`, $options: 'gi' }
            }
        ]
        return {
            $or: keywordMatch,
        };
    };
}
