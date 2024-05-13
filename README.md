# # jlabranche-mongo2sql

## Overview

The NoSQL to SQL Translator is a TypeScript library that converts MongoDB queries to SQL queries. This project aims to bridge the gap between NoSQL databases and SQL databases by providing a tool to translate MongoDB queries into their SQL equivalents.

A library to translate MongoDB queries to SQL queries.



## Features

- Supports basic MongoDB operators like `$gt`, `$gte`, `$lt`, `$lte`, `$ne`, and `$in`.
- Handles complex queries with multiple conditions.
- Supports logical operators like `$or` and `$and`.
- Translates projection queries.
- Ensures SQL injection safety.
- Supports SQL joins (`INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`).
- Handles mixed data types in `$in` operator.
- Translates MongoDB `$regex` to SQL `LIKE`.
- Gracefully handles unsupported query types.

## Installation

```sh
npm install jlabranche-mongo2sql


## Usage

const { translateToSQL } = require('jlabranche-mongo2sql');

const mongoQuery = {
  collection: "user",
  filter: { age: { $gt: 30 } }
};

const sqlQuery = translateToSQL(mongoQuery);
console.log(sqlQuery);  // Outputs: "SELECT * FROM `user` WHERE `age` > 30"
