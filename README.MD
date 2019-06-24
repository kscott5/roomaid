dotnet tool install --global Microsoft.Web.LibraryManager.Cli --version 1.0.172
dotnet tool install dotnet-aspnet-codegenerator --version 2.2.3 --global

dotnet-aspnet-codegenerator razorpage App Empty --namespaceName RoomAid.Pages -outDir Pages

sudo docker run -it --expose 27017:27017 --name mongo_dev mongo:latest
