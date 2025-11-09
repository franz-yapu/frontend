

export const userFormFields=(catalogs: any)=> {
    
      return ([
    
        {
          type: 'column',
          columns: [
            {
              fields: [
                
                {
                  key: 'firstName',
                  label: 'Nombre',
                  type: 'text',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                {
                  key: 'lastName',
                  label: 'Appellido',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },
                },
                {
                  key: 'phone',
                  label: 'Telefono',
                  type: 'number',
                  validators: { required: true },

                },
                {
                  key: 'address',
                  label: 'Direccion',
                  type: 'text',
                  validators: { required: true },
                },
                {
                  key: 'email',
                  label: 'Correo electronico',
                  type: 'email',
                    validators: { required: true },
                },
                
              
              
                
                
              ],
              
            },
            {
              fields: [
                
                {
                  key: 'username',
                  label: 'usuario',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },
                },
                {
                  key: 'password',
                  label: 'Contraseña',
                  type: 'password',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                 {
                  key: 'roleId',
                  label: 'Rol',
                  type: 'select',
                  options: catalogs['roles'],
                  validators: { required: true },

                },
                 {
                  key: 'subRole',
                  label: 'Especialidad',
                  type: 'select',
                  options: catalogs['subRole'],
                   validators: { required: true },
                  showOn : {
                        satisfy:'ALL',
                        rules:[
                         { property: 'roleId',
                          op: 'eq',
                          value : '30a3f3c0-c20e-4673-a4fc-80614cda35d2'
                         }
                        ]
                  }
                }
                
                
                
              ],
              
            },
            
        
          ]
        },
       
      
      ]
    )
   }

   export const userUpdateFormFields=(catalogs: any)=> {
    
      return ([
    
        {
          type: 'column',
          columns: [
            {
              fields: [
                
                {
                  key: 'firstName',
                  label: 'Nombre',
                  type: 'text',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                {
                  key: 'lastName',
                  label: 'Appellido',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },
                },
                {
                  key: 'phone',
                  label: 'Telefono',
                  type: 'number',
                  validators: { required: true },

                },
                {
                  key: 'address',
                  label: 'Direccion',
                  type: 'text',
                  validators: { required: true },
                },

              ],
              
            },

            
        
          ]
        },
       
      
      ]
    )
   }