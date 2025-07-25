const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeAll(async () => { await seed(2)});
afterAll(() => db.end());

describe("seed", () => {
  describe("artworks table", () => {
    test("artworks table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                SELECT FROM 
                    information_schema.tables 
                WHERE 
                    table_name = 'artworks'
                );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test("artworks table has artwork_id column as integer", () => {
      return db
        .query(
          `SELECT *
                    FROM information_schema.columns
                    WHERE table_name = 'artworks'
                    AND column_name = 'artwork_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("artwork_id");
          expect(column.data_type).toBe("integer");
        });
    });
    test("artworks table has id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'artworks';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("id");
        });
    });
    test("artworks table has image_id column as varying character of max length 50", () => {
      return db
        .query(
          `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'artworks'
            AND column_name = 'image_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("image_id");
          expect(column.data_type).toBe("character varying");
          expect(column.character_maximum_length).toBe(50);
        });
    });
        test("artworks table has daily_inspiration_date column as varying character of max length 10", () => {
      return db
        .query(
          `SELECT *
            FROM information_schema.columns
            WHERE table_name = 'artworks'
            AND column_name = 'daily_inspiration_date';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("daily_inspiration_date");
          expect(column.data_type).toBe("character varying");
          expect(column.character_maximum_length).toBe(10);
        });
    });
  });
});

describe("insert data", () => {
  test("artworks data has been inserted correctly", () => {
    return db.query(`SELECT * FROM artworks;`).then(({ rows }) => {
      rows.forEach((artwork) => {
        expect(artwork).toHaveProperty("id");
        expect(artwork).toHaveProperty("artwork_id");
        expect(artwork).toHaveProperty("image_id");
        expect(artwork).toHaveProperty("daily_inspiration_date");
      });
    });
  });
});
