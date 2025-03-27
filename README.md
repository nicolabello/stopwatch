# Stopwatch

## Steps

Generated project with

```sh
npx create-nx-workspace@latest --name=stopwatch --packageManager=yarn --nxCloud=skip  --preset=apps
```

Generated app with

```sh
yarn add @nx/angular --dev
nx g @nx/angular:application --name=stopwatch --prefix=sw --routing=true --style=scss --directory=apps/stopwatch
```

Generated PWA with

```sh
yarn add @angular/pwa --dev
nx g @angular/pwa:ng-add --project stopwatch
```
