import { translateToSQL } from '../src/translator/index';
import MongoQuery from '../src/models/MongoQuery';

describe('MongoDB to SQL Translator - Basic Operators', () => {
    it('should translate a query with $gt operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { age: { $gt: 18 } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` > 18";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with $gte operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { age: { $gte: 21 } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` >= 21";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with $lt operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { age: { $lt: 65 } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` < 65";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with $lte operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { age: { $lte: 64 } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` <= 64";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with $ne operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { status: { $ne: 'inactive' } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `status` != 'inactive'";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with $in operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { status: { $in: ['active', 'pending'] } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `status` IN ('active', 'pending')";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });
});

describe('MongoDB to SQL Translator - Complex Queries', () => {
    it('should translate a complex query with multiple conditions', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                age: { $gte: 21, $lte: 65 },
                status: { $in: ['active', 'pending'] }
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` >= 21 AND `age` <= 65 AND `status` IN ('active', 'pending')";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with mixed conditions', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                age: { $gte: 18, $lt: 30 },
                status: 'active'
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` >= 18 AND `age` < 30 AND `status` = 'active'";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with nested $or and $and operators', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                $or: [
                    { age: { $lt: 20 } },
                    { $and: [{ status: 'active' }, { name: 'Alice' }] }
                ]
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE (`age` < 20 OR (`status` = 'active' AND `name` = 'Alice'))";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle a query with an empty filter', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {}
        };
        const expectedSQL = "SELECT * FROM `user`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with projection only', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            projection: { name: 1, age: 1 }
        };
        const expectedSQL = "SELECT `name`, `age` FROM `user`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle multiple nested logical operators', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                $or: [
                    { $and: [{ age: { $gt: 18 } }, { age: { $lt: 65 } }] },
                    { $and: [{ status: 'active' }, { name: { $ne: 'Jean' } }] }
                ]
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE ((`age` > 18 AND `age` < 65) OR (`status` = 'active' AND `name` != 'Jean'))";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle mixed data types in $in operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { tag: { $in: [123, 'admin', true] } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `tag` IN (123, 'admin', true)";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle an empty $in operator gracefully', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { tag: { $in: [] } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `tag` IN ()";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with deeply nested logical operators', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                $or: [
                    { age: { $gte: 30 } },
                    { $and: [{ status: 'active' }, { $or: [{ name: 'Alice' }, { age: { $lt: 25 } }] }] }
                ]
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE (`age` >= 30 OR (`status` = 'active' AND (`name` = 'Alice' OR `age` < 25)))";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should combine multiple operators in a single query', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: {
                age: { $gte: 18, $lt: 60 },
                status: { $ne: 'inactive' }
            }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `age` >= 18 AND `age` < 60 AND `status` != 'inactive'";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });
});

describe('MongoDB to SQL Translator - Invalid Fields / Logical Operators', () => {
    it('should handle potentially invalid field names', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { 'user.name': 'Alice', 'user-age': { $gt: 25 } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `user.name` = 'Alice' AND `user-age` > 25";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle invalid logical operator arrays gracefully', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { $or: [] }
        };
        const expectedSQL = "SELECT * FROM `user`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });
});

describe('MongoDB to SQL Translator - Safety Tests for Injections', () => {
    it('should ensure SQL injection safety', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { name: "'; DROP TABLE users; --" }
        };
        // Expect double single quotes for proper escaping in SQL
        const expectedSQL = "SELECT * FROM `user` WHERE `name` = '''; DROP TABLE users; --'";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });
});

describe('MongoDB to SQL Translator - Join Tests', () => {
    it('should translate a query with an inner join', () => {
        const mongoQuery: MongoQuery = {
            collection: 'orders',
            join: {
                type: 'INNER',
                collection: 'users',
                localField: 'userId',
                foreignField: 'id'
            },
            projection: { orderId: 1, userName: 1 }
        };
        const expectedSQL = "SELECT `orderId`, `userName` FROM `orders` INNER JOIN `users` ON `orders`.`userId` = `users`.`id`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with a left outer join', () => {
        const mongoQuery: MongoQuery = {
            collection: 'orders',
            join: {
                type: 'LEFT',
                collection: 'users',
                localField: 'userId',
                foreignField: 'id'
            },
            projection: { orderId: 1, userName: 1 }
        };
        const expectedSQL = "SELECT `orderId`, `userName` FROM `orders` LEFT JOIN `users` ON `orders`.`userId` = `users`.`id`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with a right outer join', () => {
        const mongoQuery: MongoQuery = {
            collection: 'orders',
            join: {
                type: 'RIGHT',
                collection: 'users',
                localField: 'userId',
                foreignField: 'id'
            },
            projection: { orderId: 1, userName: 1 }
        };
        const expectedSQL = "SELECT `orderId`, `userName` FROM `orders` RIGHT JOIN `users` ON `orders`.`userId` = `users`.`id`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });
});

describe('MongoDB to SQL Translator - Projection Tests', () => {
    it('should translate a query with projection only', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            projection: { name: 1, status: 1 }
        };
        const expectedSQL = "SELECT `name`, `status` FROM `user`";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle unsupported query types gracefully', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { unsupported: { $unsupported: 'value' } }
        };
        expect(() => translateToSQL(mongoQuery)).toThrow("Unsupported operator: $unsupported");
    });

    it('should handle mixed data types in $in operator', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { tag: { $in: [123, 'admin', true] } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `tag` IN (123, 'admin', true)";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should translate a query with LIKE operator using $regex', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { name: { $regex: 'Alice' } }
        };
        const expectedSQL = "SELECT * FROM `user` WHERE `name` LIKE '%Alice%'";
        expect(translateToSQL(mongoQuery).toString()).toEqual(expectedSQL);
    });

    it('should handle unsupported regex patterns gracefully', () => {
        const mongoQuery: MongoQuery = {
            collection: 'user',
            filter: { name: { $regex: '^(?=.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$', $options: 'i' } } // Complex regex
        };
        expect(() => translateToSQL(mongoQuery)).toThrow("Unsupported regex pattern");
    });
});
