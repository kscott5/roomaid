using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace RoomAid
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Variable configured at IDE level or launch.json, but
            // OS level configuration is expected.
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile($"appsettings.{environment}.json", true)
                .AddCommandLine(args)
                .Build();

            var webHost = WebHost.CreateDefaultBuilder()
                .UseConfiguration(configuration)
                .UseStartup<Startup>().Build();

            webHost.Run();
        }
    }
}
