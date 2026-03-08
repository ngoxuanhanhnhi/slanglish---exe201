FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["EnglishApp.Api/EnglishApp.Api.csproj", "EnglishApp.Api/"]
COPY ["EnglishApp.Service/EnglishApp.Service.csproj", "EnglishApp.Service/"]
COPY ["EnglishApp.Infrastructure/EnglishApp.Infrastructure.csproj", "EnglishApp.Infrastructure/"]
COPY ["EnglishApp.Core/EnglishApp.Core.csproj", "EnglishApp.Core/"]
RUN dotnet restore "EnglishApp.Api/EnglishApp.Api.csproj"
COPY . .
WORKDIR "/src/EnglishApp.Api"
RUN dotnet build "EnglishApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EnglishApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "EnglishApp.Api.dll"]
