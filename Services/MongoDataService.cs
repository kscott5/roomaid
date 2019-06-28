using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using MongoDB.Bson;
using MongoDB.Driver;

using RoomAid.Models;
using RoomAid.Extensions;

namespace RoomAid.Services {
    public class MongoDataService {

        private IMongoDatabase Database {get; set;}
        private ILogger Logger {get; set;}

        public MongoDataService(ILogger<MongoDataService> logger, IConfiguration configuration ) {
            this.Logger = logger;
            
            var connectionUrl = configuration.GetValue<string>("mongo:connectionUrl");
            var databaseName = configuration.GetValue<string>("mongo:databaseName");

            var client = new MongoClient(connectionUrl);
            this.Database = client.GetDatabase(databaseName);
        }

        public PaginationResult<Room> GetRooms(FilterDefinition<Room> where = null, SortDefinition<Room> sort = null, int page = 1, int limit = 5) {
            var collection = this.Database.GetCollection<Room>(Room.COLLECTION_NAME);

            var emptyFilter = FilterDefinition<Room>.Empty;
            var filter = where ?? emptyFilter;
            var sortBy = sort ?? Builders<Room>.Sort.Ascending(room => room.Name);
            
            var count = collection.Find(emptyFilter).CountDocuments();
            var pageCount = (count/limit) + ((count%limit > 0)? 1: 0);
            
            var skip = 0;
            if(page-1>0 && page<=pageCount) {
                skip = (page-1)*limit /* per page */;
            }

            var documents = collection.Find(filter)
                .Limit(limit)
                .Sort(sortBy)
                .Skip(skip)
                .ToList();

            return new PaginationResult<Room> {
                Documents = documents,
                Limit = limit,
                Pages = pageCount,
                Page = page
            };
        }

        public Room GetRoom(string id) {
            var where = Builders<Room>.Filter.Where(room => room.Id.Equals(id));

            return GetRooms(where)
                .Documents?.SingleOrDefault();
        }

        public Room InsertNewRoom(Room room) {
            this.Logger.LogDebug($"InsertNewRoom({room}");

            var collection = this.Database.GetCollection<Room>(Room.COLLECTION_NAME);
            
            // automap generates a unique identifier
            collection.InsertOne(room);
            
            this.Logger.LogDebug($"InsertNewRoom({room}");

            return room;
        }

        public Room UpdateRoom(Room room) {
            this.Logger.LogDebug($"UpdateRoom({room}");

            var collection = this.Database.GetCollection<Room>(Room.COLLECTION_NAME);
            
            var filter = Builders<Room>.Filter.Eq("_id", room.Id);
            var update = Builders<Room>.Update.Definition(room);
            
            collection.UpdateOne(filter, update);

            this.Logger.LogDebug($"UpdateRoom({room}");

            return room;
        }
    }
}