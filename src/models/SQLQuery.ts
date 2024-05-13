class SQLQuery {
    private selectFields: string[] = [];
    private tableName: string = '';
    private whereClauses: string[] = [];
    private joinClause: string = '';
    private query: string = '';  // Add this line

    constructor(query?: string) {  // Add an optional parameter to the constructor
        if (query) {
            this.query = query;  // Store the query string if provided
        }
    }

    setSelectFields(fields: string[]): void {
        this.selectFields = fields;
    }

    setTableName(name: string): void {
        this.tableName = name;
    }

    addWhereClause(clause: string): void {
        this.whereClauses.push(clause);
    }

    setJoinClause(joinClause: string): void {
        this.joinClause = joinClause;
    }

    toString(): string {
        if (this.query) {
            return this.query;  // Return the stored query string if it exists
        }
        const select = this.selectFields.length > 0 ? this.selectFields.join(', ') : '*';
        const where = this.whereClauses.length > 0 ? ` WHERE ${this.whereClauses.join(' AND ')}` : '';
        return `SELECT ${select} FROM ${this.tableName}${this.joinClause}${where}`.trim();
    }
}

export default SQLQuery;
