export interface MongoQuery {
    collection: string;
    filter?: any;
    aggregate?: any[];
    projection?: {
        [key: string]: number;
    };
    join?: {
        type: "INNER" | "LEFT" | "RIGHT";
        collection: string;
        localField: string;
        foreignField: string;
    };
}
export interface SQLQuery {
    select: string;
    from: string;
    where?: string;
}
