CREATE TYPE osoption AS ENUM ('Windows', 'Linux', 'MacOS');
	
CREATE TABLE IF NOT EXISTS developers_info(
	"id" SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" osoption NOT NULL,
);

CREATE TABLE IF NOT EXISTS developers(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) NOT NULL,
	"developerInfoID" INTEGER UNIQUE,
	FOREIGN KEY ("developerInfoID") REFERENCES developers_info(id) ON DELETE CASCADE
);
		
CREATE TABLE IF NOT EXISTS projects(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE NOT NULL,
	"developerId" INTEGER NOT NULL, 
	FOREIGN KEY ("developerId") REFERENCES developers(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS technologies(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

   CREATE TABLE IF NOT EXISTS projects_technologies(
	"id" SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	"technologyId" INTEGER NOT NULL,
	FOREIGN KEY ("projectId") REFERENCES projects(id),
	FOREIGN KEY ("technologyId") REFERENCES technologies(id)
);