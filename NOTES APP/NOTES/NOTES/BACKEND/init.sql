CREATE DATABASE notes;

CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description JSONB,
    date DATE NOT NULL,
    creation_date DATE DEFAULT now()
)

INSERT INTO notes (id, title, description, date) VALUES (DEFAULT, 'test1', '{
    "type": "doc",
    "content": [
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "aaaaaaaaaa"
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "text": "aaaaaa"
                }
            ]
        }
    ]
}', '2026-11-09')