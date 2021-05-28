export async function loadRoutes(
  app: Express,
  routes: RouteInterface[],
  apm: Apm
) {
  // const defaultMiddlewares: any[] = [trimRequest.all];
  for (const route of routes) {
    // let middlewares = defaultMiddlewares.slice(0);

    if (route.middlewares) {
      middlewares = middlewares.concat(route.middlewares);
    }

    app[route.method](
      route.path,
      // middlewares,
      async (
        request: Request,
        response: ResponseInterface,
        next: NextFunction
      ) => {
        // 2 minutes
        const defaultTimeout = 2 * 60;
        const timeout =
          route.timeout || process.env.SERVER_TIMEOUT || defaultTimeout;

        request.setTimeout(Number(timeout) * 1000, () => {
          console.info(`Route ${route.path} got timeout of ${timeout} seconds`);
        });

        response.locals.queryManager = new QueryManager();
        response.locals.apm = apm;
        apm.setTransactionName(`${route.method.toLowerCase()} ${route.path}`);

        if (route.protected) {
          try {
            let authorization: any = request.headers["authorization"];
            if (!authorization) {
              throw new Error("Token Bearer not found");
            }

            authorization = authorization.split("Bearer ");

            if (authorization.length === 1) {
              throw new Error("Token Bearer not found");
            }

            const auth = await JwtHelper.verify(authorization[1]);

            if (!auth) {
              throw new Error("Token Bearer invalid");
            }

            response.locals.auth = auth;
          } catch (e) {
            response.status(403).send({ message: e.message });
            return next();
          }
        }

        try {
          await route.action(request, response);
        } catch (e) {
          next(e);
        } finally {
          await response.locals.queryManager.release();
        }
      }
    );
  }
}
