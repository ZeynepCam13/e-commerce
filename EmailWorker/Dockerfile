FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src/EmailWorker

#Sadece worker'ın projelerini kopyala
COPY EmailWorker/EmailWorker.csproj ./
COPY Shared/Shared.csproj ../Shared/

# Shared restore et
WORKDIR /src
RUN dotnet restore EmailWorker/EmailWorker.csproj

# worker
COPY EmailWorker ./EmailWorker
COPY Shared ./Shared

#Publish et
WORKDIR /src/EmailWorker
RUN dotnet publish -c Release -o /publish


FROM mcr.microsoft.com/dotnet/runtime:9.0
WORKDIR /worker
COPY --from=build /publish .

ENTRYPOINT ["dotnet", "EmailWorker.dll"]
