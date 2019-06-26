using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using RoomAid.Models;
using RoomAid.Services;

namespace RoomAid.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase {

        private ILogger Logger {get; set;}
        private MongoDataService DataService {get; set;}
        public RoomController(ILogger<RoomController> logger, MongoDataService dataService) {
            this.Logger = logger;
            this.DataService = dataService;
        }

        [HttpGet]
        public ActionResult<IList<Room>> GetRooms() {
            var rooms = this.DataService.GetRooms();
            return new ObjectResult(rooms);
        }

        [HttpGet("{id}")]
        public ActionResult<Room> GetRoom(string id) {
            var result = this.DataService.GetRoom(id);

            if(result == null)
                return new BadRequestObjectResult(new Room{Id = id});
            return new ObjectResult(result);
        }

        [HttpPost]
        public ActionResult<Room> NewRoom(Room room) {
            var result = this.DataService.InsertNewRoom(room);

            return new ObjectResult(result);
        }

        [HttpPost("update")]
        public ActionResult<Room>  UpdateRoom(Room room) {
            var result = this.DataService.UpdateRoom(room);

            return new ObjectResult(result);
        }
    }
}