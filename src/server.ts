import fastify from "fastify";
import fs from "fs";
import path from "path";
import cors from '@fastify/cors';

import { TeamParams } from "./models/team-params";
import { DriverParams } from "./models/driver-params";
import { RequestParams } from "./models/request-params";

const server = fastify({ logger: true });

server.register(cors, {
    origin: "*",
});

const teamsData = path.join(__dirname, "./teams.json");
const driversData = path.join(__dirname, "./drivers.json");

const rawTeamsData = fs.readFileSync(teamsData, "utf-8");
const rawDriversData = fs.readFileSync(driversData, "utf-8");

const teams: TeamParams[] = JSON.parse(rawTeamsData);
const drivers: DriverParams[] = JSON.parse(rawDriversData);

server.get("/teams", async(request, response) => {
    if (teams.length === 0) {
        response.type("application/json").code(204);
    } else {
        response.type("application/json").code(200);
    }
    return { teams };
});

server.get("/drivers", async(request, response) => {
    if (drivers.length === 0) {
        response.type("application/json").code(204);
    } else {
        response.type("application/json").code(200);
    }
    return { drivers };
});

server.get<{ Params: RequestParams }>("/drivers/:id", async (request, response) => {
    let id: number = parseInt(request.params.id);
    let driver: DriverParams[] = drivers.filter((d: DriverParams)=> d.id === id);
    if(driver.length === 0) {
        response.type("application/json").code(404);
        return {
            message: "Driver Not Found!"
        }
    } else {
        response.type("application/json").code(200);
        return {
            driver
        }
    }
});

server.get<{Params: RequestParams}>("/teams/:id", async (request, response) => {
    let id: number = parseInt(request.params.id);
    let team: TeamParams[] = teams.filter((t: TeamParams)=> t.id === id);
    if(team.length === 0) {
        response.type("application/json").code(404);
        return {
            message: "Team Not Found!"
        };
    } else {
        response.type("application/json").code(200);
        return {
            team
        };
    }
});

server.listen({ port: parseInt(`${process.env.PORT}`)}, ()=> {
    console.log(`Servidor inicializado na porta ${process.env.PORT}`);
})