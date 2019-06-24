using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;

using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

using RoomAid.Models;

namespace RoomAid.Services {
    public class MongoDataService {

        private IMongoDatabase Database {get; set;}

        public MongoDataService(IConfiguration configuration ) {
            var connectionUrl = configuration.GetValue<string>("mongo:connectionUrl");
            var databaseName = configuration.GetValue<string>("mongo:databaseName");

            var client = new MongoClient(connectionUrl);
            this.Database = client.GetDatabase(databaseName);
        }

        public IList<Room> GetRooms() {
            var collection = this.Database.GetCollection<Room>(Room.COLLECTION_NAME);
            return collection.Find("{}").ToList();
        }

        public Room SaveRoom(Room room) {
            var collection = this.Database.GetCollection<Room>(Room.COLLECTION_NAME);
            collection.InsertOne(room);
            
            return room;
        }
    }
}