"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSQL = void 0;
function escapeSqlValue(value) {
    return value.replace(/'/g, "''");
}
function processCondition(condition) {
    const columnName = condition.column;
    const operator = Object.keys(condition.value)[0];
    const operand = condition.value[operator];
    switch (operator) {
        case '$eq':
            return `${columnName} = '${escapeSqlValue(operand)}'`;
        case '$gt':
            return `${columnName} > ${operand}`;
        case '$gte':
            return `${columnName} >= ${operand}`;
        case '$lt':
            return `${columnName} < ${operand}`;
        case '$lte':
            return `${columnName} <= ${operand}`;
        case '$ne':
            return `${columnName} != '${escapeSqlValue(operand)}'`;
        case '$in':
            if (Array.isArray(operand)) {
                const inList = operand.map((el) => typeof el === 'string' ? `'${escapeSqlValue(el)}'` : el);
                return `${columnName} IN (${inList.join(', ')})`;
            }
            throw new Error(`Unsupported operand for $in: ${operand}`);
        case '$regex':
            return `${columnName} LIKE '%${escapeSqlValue(operand)}%'`;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}
function processConditions(conditions, logic) {
    const value = conditions[logic];
    const conditionStrings = value.map((cond) => processCondition(cond)).filter((c) => c).join(` ${logic} `);
    return conditionStrings;
}
function translateToSQL(query) {
    const { collection, filter, projection, join } = query;
    let selectClause = 'SELECT *';
    if (projection) {
        const projectionFields = Object.keys(projection).map(field => `\`${field}\``).join(', ');
        selectClause = `SELECT ${projectionFields}`;
    }
    const fromClause = `FROM \`${collection}\``;
    let joinClause = '';
    if (join) {
        const joinType = join.type.toUpperCase();
        const joinCollection = join.collection;
        const localField = join.localField;
        const foreignField = join.foreignField;
        joinClause = `${joinType} JOIN \`${joinCollection}\` ON \`${collection}\`.\`${localField}\` = \`${joinCollection}\`.\`${foreignField}\``;
    }
    const whereConditions = Object.entries(filter).map(([column, value]) => {
        const condition = { column, value };
        return processCondition(condition);
    });
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    return [selectClause, fromClause, joinClause, whereClause].filter(part => part !== '').join(' ');
}
exports.translateToSQL = translateToSQL;
