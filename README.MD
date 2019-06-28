# Room Aid
Simple ASP.NET Core 2.2 app that uses
- C# Razor Page
- HTML5, CSS3 & Javascript
- Web API with Mongo CRUD
- Mongo Docker Container
- Responsive Design
- Vuejs & Vue-Router - Single Page Application, SPA
- Pagination
- Bulma & Font-awesome icons  

  
<iframe width="560" height="315" src="https://github.com/kscott5/roomaid/blob/master/wwwroot/assets/roomaid.mp4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
  
>[Markdown Guide](https://guides.github.com/features/mastering-markdown/)  
>[Visual Code](https://code.visualstudio.com/)  
>[Chrome extensions](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)  
>[Mongo Docker Hub](https://hub.docker.com/_/mongo)  

# Terminal or powershell 
```shell

# css stylesheet and javascript manager
dotnet tool install --global Microsoft.Web.LibraryManager.Cli --version 1.0.172
libman restore

# The use of the codegenerator is difficult
dotnet tool install dotnet-aspnet-codegenerator --version 2.2.3 --global
dotnet-aspnet-codegenerator razorpage App Empty --namespaceName RoomAid.Pages -outDir Pages

# loads the container
sudo docker run -it --expose 27017:27017 --name mongo_dev mongo:latest

# starts the container
sudo docker start mongo_dev

# starts the container with interactive output viewer
sudo docker start -i mongo_dev
```