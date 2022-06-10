// This example demonstrates how to use RediSearch to index and query data 
// stored in Redis hashes.

import { createClient, SchemaFieldTypes } from 'redis';

async function searchHashes() {
  const client = createClient();

  await client.connect();

  // Create an index...
  try {
    // Documentation: https://oss.redis.com/redisearch/Commands/#ftcreate
    await client.ft.create('idx:animals', {
      name: {
        type: SchemaFieldTypes.TEXT,
        sortable: true
      },
      species: SchemaFieldTypes.TAG,
      age: SchemaFieldTypes.NUMERIC
    }, {
      ON: 'HASH',
      PREFIX: 'noderedis:animals'
    });
  } catch (e) {
    if (e.message === 'Index already exists') {
      console.log('Index exists already, skipped creation.');
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      process.exit(1);
    }
  }

  // Add some sample data...
  await Promise.all([
    client.hSet('noderedis:animals:1', {name: 'Fluffy', species: 'cat', age: 3}),
    client.hSet('noderedis:animals:2', {name: 'Ginger', species: 'cat', age: 4}),
    client.hSet('noderedis:animals:3', {name: 'Rover', species: 'dog', age: 9}),
    client.hSet('noderedis:animals:4', {name: 'Fido', species: 'dog', age: 7})
  ]);

  // Perform a search query, find all the dogs... sort by age, descending.
  // Documentation: https://oss.redis.com/redisearch/Commands/#ftsearch
  // Query synatax: https://oss.redis.com/redisearch/Query_Syntax/
  const results = await client.ft.search(
    'idx:animals', 
    '@species:{dog}',
    {
      SORTBY: {
        BY: 'age',
        DIRECTION: 'DESC' // or 'ASC' (default if DIRECTION is not present)
      }
    }
  );

  // results:
  // {
  //   total: 2,
  //   documents: [
  //     {
  //       id: 'noderedis:animals:3',
  //       value: {
  //         age: '9',
  //         name: 'Rover',
  //         species: 'dog'
  //       }
  //     },
  //     {
  //       id: 'noderedis:animals:4',
  //       value: {
  //         age: '7',
  //         name: 'Fido',
  //         species: 'dog'
  //       }
  //     }
  //   ]
  // }
 
  console.log(`Results found: ${results.total}.`);

  for (const doc of results.documents) {
    // noderedis:animals:3: Rover, 9 years old.
    // noderedis:animals:4: Fido, 7 years old.
    console.log(`${doc.id}: ${doc.value.name}, ${doc.value.age} years old.`);
  }

  await client.quit();
}

searchHashes();