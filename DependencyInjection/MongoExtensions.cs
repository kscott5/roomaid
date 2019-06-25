using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;

using RoomAid.Models;
using RoomAid.Services;

namespace Microsoft.Extensions.DependencyInjection {
    public static class MongoExtensions {
        private static void RegisterClassMaps() {
            BsonClassMap.RegisterClassMap<Room>(cm =>{
                cm.AutoMap();
                cm.MapIdMember(c => c.Id).SetIdGenerator(StringObjectIdGenerator.Instance);
            });
        } // end RegisterClassMaps

        public static void AddMongoDataService(this IServiceCollection service) {
            RegisterClassMaps();

            service.AddScoped<MongoDataService>();            
        }
    }
}
