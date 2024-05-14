import MongoQuery from '../models/MongoQuery';
import SQLQuery from '../models/SQLQuery';

export function translateToSQL(mongoQuery: MongoQuery): SQLQuery {
    const { collection, filter, projection, join } = mongoQuery;

    const selectFields = projection ? Object.keys(projection).map(field => `\`${field}\``).join(', ') : '*';
    const tableName = `\`${collection}\``;
    const conditions = filter ? processConditions(filter) : '';
    const whereClause = conditions ? ` WHERE ${conditions}` : '';

    const joinClause = join ? getJoinClause(join, collection) : '';

    const query = `SELECT ${selectFields} FROM ${tableName}${joinClause}${whereClause}`.trim();
    return new SQLQuery(query);
}

function getJoinClause(join: any, collection: string): string {
    const joinType = join.type.toUpperCase();
    const joinTable = `\`${join.collection}\``;
    const joinCondition = `\`${collection}\`.\`${join.localField}\` = \`${join.collection}\`.\`${join.foreignField}\``;
    return ` ${joinType} JOIN ${joinTable} ON ${joinCondition}`;
}

function processConditions(conditions: Record<string, any>, parentIsLogic: boolean = false): string {
    const logicOperators = ['$or', '$and'];
    const clauses = Object.entries(conditions).map(([key, value]) => {
        if (logicOperators.includes(key)) {
            return processLogicalOperator(key, value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return Object.entries(value).map(([op, val]) => processCondition(key, op, val)).join(' AND ');
        } else {
            return `\`${key}\` = '${escapeSqlValue(String(value))}'`;
        }
    }).filter(Boolean).join(parentIsLogic ? ` ` : ' AND ');

    return parentIsLogic ? clauses : clauses;
}

function processLogicalOperator(operator: string, conditions: any[]): string {
    const logic = operator === '$or' ? 'OR' : 'AND';
    if (Array.isArray(conditions) && conditions.length > 0) {
        const nestedConditions = conditions.map(subCondition => processConditions(subCondition, true)).join(` ${logic} `);
        return `(${nestedConditions})`;
    }
    return '';
}

function processCondition(columnName: string, operator: string, operand: any): string {
    if (operator === '$options') throw new Error("Unsupported regex pattern");

    switch (operator) {
        case '$eq':  return `\`${columnName}\` = '${escapeSqlValue(String(operand))}'`;
        case '$gt':  return `\`${columnName}\` > ${operand}`;
        case '$gte': return `\`${columnName}\` >= ${operand}`;
        case '$lt':  return `\`${columnName}\` < ${operand}`;
        case '$lte': return `\`${columnName}\` <= ${operand}`;
        case '$ne':  return `\`${columnName}\` != '${escapeSqlValue(String(operand))}'`;
        case '$in':
            if (Array.isArray(operand)) {
                const inList = operand.map(el => typeof el === 'string' ? `'${escapeSqlValue(el)}'` : el).join(', ');
                return `\`${columnName}\` IN (${inList})`;
            }
            throw new Error(`Unsupported operand for $in: ${operand}`);
        case '$regex': return `\`${columnName}\` LIKE '%${escapeSqlValue(String(operand))}%'`;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

function escapeSqlValue(value: string): string {
    return value.replace(/'/g, "''");
}
