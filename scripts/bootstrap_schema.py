#!/usr/bin/env python3
"""
Neo4j schema bootstrap script.
Creates constraints and vector indexes from wiki/03-graph-schema.md.
Idempotent — safe to run twice, uses IF NOT EXISTS.
"""
import os
import asyncio
from neo4j import AsyncGraphDatabase
from dotenv import load_dotenv

load_dotenv()

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


UNIQUE_CONSTRAINTS = [
    "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
    "CREATE CONSTRAINT paper_id_unique IF NOT EXISTS FOR (p:Paper) REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT author_id_unique IF NOT EXISTS FOR (a:Author) REQUIRE a.id IS UNIQUE",
    "CREATE CONSTRAINT chunk_id_unique IF NOT EXISTS FOR (c:Chunk) REQUIRE c.id IS UNIQUE",
    "CREATE CONSTRAINT concept_id_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE",
]

VECTOR_INDEXES = [
    """
    CREATE VECTOR INDEX chunk_embeddings IF NOT EXISTS
    FOR (c:Chunk) ON (c.embedding)
    OPTIONS { indexConfig: {
      `vector.dimensions`: 768,
      `vector.similarity_function`: 'cosine'
    }}
    """,
    """
    CREATE VECTOR INDEX concept_embeddings IF NOT EXISTS
    FOR (c:Concept) ON (c.embedding)
    OPTIONS { indexConfig: {
      `vector.dimensions`: 768,
      `vector.similarity_function`: 'cosine'
    }}
    """,
]


async def bootstrap_schema():
    driver = AsyncGraphDatabase.driver(URI, auth=(USER, PASSWORD))
    try:
        async with driver.session() as session:
            # Create unique constraints
            for constraint in UNIQUE_CONSTRAINTS:
                print(f"Creating constraint: {constraint.strip().split()[2]}")
                await session.run(constraint)
            
            # Create vector indexes
            for index in VECTOR_INDEXES:
                print(f"Creating vector index...")
                await session.run(index)
            
            print("Schema bootstrap completed successfully!")
            
            # Verify indexes exist
            result = await session.run("SHOW VECTOR INDEXES")
            indexes = [record["name"] async for record in result]
            print(f"Vector indexes found: {indexes}")
            
            expected = {"chunk_embeddings", "concept_embeddings"}
            found = set(indexes)
            if expected.issubset(found):
                print("✓ Both chunk_embeddings and concept_embeddings indexes verified")
            else:
                print(f"✗ Missing indexes. Expected: {expected}, Found: {found}")
                
    finally:
        await driver.close()


if __name__ == "__main__":
    asyncio.run(bootstrap_schema())