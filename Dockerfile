# Use the official .NET 10.0 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# Copy the backend project files
COPY studentProjectManagement/ ./studentProjectManagement/
WORKDIR /app/studentProjectManagement

# Restore dependencies
RUN dotnet restore

# Build and publish the release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/studentProjectManagement/out .

# Expose port 80 (Render forwards traffic here)
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

# Start the application
ENTRYPOINT ["dotnet", "studentProjectManagement.dll"]

