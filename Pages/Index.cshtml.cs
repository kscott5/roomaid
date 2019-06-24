using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using RoomAid.Services;
using RoomAid.Models;

namespace RoomAid.Pages
{
    public class IndexModel : PageModel
    {
        private MongoDataService DataService {get; set;}
        public IndexModel(MongoDataService service) {
            this.DataService = service;
        }
        public void OnGet()
        {
            var room = new Room{
                Description = "This is a simple room",
                Height = 10,
                Width = 10,
                Length = 10,
                RoomName = "Simple Room"
                
            };

            room = this.DataService.SaveRoom(room);
        }
    }
}
