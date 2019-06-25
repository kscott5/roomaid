using MongoDB.Driver;

using RoomAid.Models;

namespace RoomAid.Extensions{
    public static class RoomExtensions {
        public static UpdateDefinition<Room> Definition(this UpdateDefinitionBuilder<Room> definition, Room room) {            

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
    }
}