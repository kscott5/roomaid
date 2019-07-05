using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Driver;

using RoomAid.Models;

namespace RoomAid.Extensions{
    public static class RoomExtensions {
        public static UpdateDefinition<Room> RoomDefinition(this UpdateDefinitionBuilder<Room> definition, Room room) {            

            // NOTE: Set updates a single json item
            //       AddToSet updates a single json array item
            //       Push updates a single json map item
            return definition.Set("Name", room.Name)
                .Set("Description", room.Description)
                .Set("Length", room.Length)
                .Set("Width", room.Width)
                .Set("Height", room.Height)
                .Set("Edges", room.Edges);
        }

        public static IMongoCollection<Room> RoomCollection(this IMongoDatabase database) {
            return database.GetCollection<Room>(Room.COLLECTION_NAME);
        }

        public static List<BsonDocument> RoomIndexes(this IMongoDatabase database) {
            var indexKeys = Builders<Room>.IndexKeys.Text(key=> key.Name).Text(key=>key.Description);            
            var indexModels = new CreateIndexModel<Room>(indexKeys);
            
            database.RoomCollection().Indexes.CreateOne(indexModels);

            return database.RoomCollection().Indexes.List().ToList();
        }
    }
}