db = db.getSiblingDB('mountain_tracker');
db.createCollection('activities', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'type', 'done', 'createdAt', 'updatedAt'],
      properties: {
        title: { bsonType: 'string' },
        notes: { bsonType: 'string' },
        link: { bsonType: 'string' },
        type: { bsonType: 'string', enum: ['via_ferrata','via_multipitch','canale_invernale','cresta','escursionismo','alpinismo','sci_alpinismo','arrampicata','altro'] },
        guideType: { bsonType: ['string', 'null'], enum: ['alpina','ambientale','amm',null] },
        done: { bsonType: 'bool' },
        doneAt: { bsonType: ['date', 'null'] },
        doneNotes: { bsonType: ['string', 'null'] },
        guideName: { bsonType: ['string', 'null'] },
      },
    },
  },
  validationAction: 'warn',
});
db.activities.createIndex({ createdAt: -1 });
db.activities.createIndex({ type: 1 });
db.activities.createIndex({ done: 1 });
db.activities.createIndex({ guideType: 1 });
print('Mountain Tracker DB inizializzato');
