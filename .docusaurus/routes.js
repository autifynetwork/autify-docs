import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '0d8'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '9ed'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'd35'),
            routes: [
              {
                path: '/API_DOCUMENTATION',
                component: ComponentCreator('/API_DOCUMENTATION', '03e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/changelog',
                component: ComponentCreator('/changelog', 'ae8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/COMPONENT_DOCUMENTATION',
                component: ComponentCreator('/COMPONENT_DOCUMENTATION', '76d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/SUPABASE_DOCUMENTATION',
                component: ComponentCreator('/SUPABASE_DOCUMENTATION', 'f04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
