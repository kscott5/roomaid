using System;

namespace RoomAid.Models {    
    public class Room {
        public static string COLLECTION_NAME = "rooms";

        public string Id {get; set;}

        public string RoomName {get; set;}

        public string Description {get; set;}

        public int Edges {get ;set;}

        public int Width {get; set;}
        public int Height {get; set;}

        public int Length {get; set;}
    }
}