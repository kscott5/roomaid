using System;
using System.Text;

namespace RoomAid.Models {    
    public class Room {
        public static string COLLECTION_NAME = "rooms";

        public string Id {get; set;}

        public string Name {get; set;}

        public string Description {get; set;}

        public int Edges {get ;set;}

        public int Width {get; set;}
        public int Height {get; set;}

        public int Length {get; set;}

        public override string ToString() {
            var builder = new StringBuilder();

            builder.Append("{");
            builder.Append($"Id: '{Id}', ");
            builder.Append($"RoomName: '{Name}', ");
            builder.Append($"Description: '{Description}', ");
            builder.Append($"Edges: {Edges}, ");
            builder.Append($"Width: {Width}, ");
            builder.Append($"Height: {Height}, ");
            builder.Append($"Length: {Length}");
            builder.AppendLine("}");
            
            return builder.ToString();
        }
    }
}