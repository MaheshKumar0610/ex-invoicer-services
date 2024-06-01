export const dbConfig = {
    // Configuration for Database 1
    db: {
      users: {
        name: 'USERS',
        employees: {
          collection: 'employees'
        },
      },
      billing:{
        name: 'BILLING',
        collection: {
          billing: 'billing',
          shipTo: 'shipTo'
        }
      },
      inventory: {
        name: 'INVENTORY',
        collection: {
          inventory: 'productInventory',
          sku: 'sku'
        },
        sku:{
          collection:'sku'
        },
        pricing: {
          collection: 'pricing'
        },
        discounts: {
          collection: 'discounts'
        },
        // productImages: {
        //   collection: 'productImages'
        // },

      },
      organisation: {
        name: 'ORGANISATION',
        orgDetails: {
          collection: 'orgConfigs'
        },
        orgEmployees: {
          collection: 'orgEmployee-association'
        }
      }
    },
  
    // Configuration for Database 2
    database2: {
      collections: {
        customers: {
          // Collection-specific configuration for Database 2
          // Add any other collection-specific options here
        },
        orders: {
          // Collection-specific configuration for Database 2
          // Add any other collection-specific options here
        },
        // Add more collections for Database 2 if needed
      },
      // Add any other database-specific options for Database 2
    },
  
    // Add more databases if needed
  };
  