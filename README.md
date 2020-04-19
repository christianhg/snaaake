# 🅂🄽🄰🄰🄰🄺🄴

[![Netlify Status](https://api.netlify.com/api/v1/badges/7b7a8288-709b-4f69-8fc9-912a94094c97/deploy-status)](https://app.netlify.com/sites/snaaake/deploys)

> A snake game driven by [XState](https://xstate.js.org/)

Demo: [https://snaaake.netlify.app](snaaake.netlify.app)

![Snaaake](snaaake.png)

## Why?

The goal of Snaaake is to implement a game using statecharts where the driving statechart is agnostic to the implementation details of the game.

The statechart controls the direction of the snake, but is unaware of how to actually move or grow it. Similarly, the statechart isn't concerned with how the bounds, the apples or even the snake itself are defined. To the statechart these have a generic shape. This has a couple of advantages:

* It provides a clear separation of concerns. How the snake game looks has little to do with how it works at the foundational level.
* It makes it possible to implement different variations of snake on top of the same, generic statechart.
* It makes unit testing of the statechart easier since the test data can be simplified.

## Visualization

https://xstate.js.org/viz/?gist=15582ab43cd031fbb01e62accf5b32ce

![Visualization](viz.png)
