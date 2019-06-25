using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace RoomAid.Pages
{
    public class IndexModel : PageModel
    {
        private ILogger Logger {get; set;}
        public IndexModel(ILogger<IndexModel> logger) {
            this.Logger = logger;
        }

        public void OnGet()
        {            
        }
    }
}
