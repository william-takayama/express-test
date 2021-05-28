import express, { Request, Response } from "express";

export class IndexController {
  public static async welcome(req: Request, res: Response) {
    console.log("WELCOME TO MY FIRST ENDPOINT");
    res.send({
      welcome: "Welcome to my service",
      date_time: new Date(),
    });
  }
}
