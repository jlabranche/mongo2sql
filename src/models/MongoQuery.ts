interface MongoJoin {
    type: "INNER" | "LEFT" | "RIGHT";
    collection: string;
    localField: string;
    foreignField: string;
}

class MongoQuery {
    collection: string;
    filter?: any;
    projection?: { [key: string]: number };
    join?: MongoJoin;

    constructor(collection: string, filter?: any, projection?: { [key: string]: number }, join?: MongoJoin) {
        this.collection = collection;
        if (filter) this.filter = filter;
        if (projection) this.projection = projection;
        if (join) this.join = join;
    }
}

export default MongoQuery
