# 1) Build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY API/API.csproj API/
COPY Shared/Shared.csproj Shared/
RUN dotnet restore API/API.csproj

COPY . .
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish

# 2) Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]
