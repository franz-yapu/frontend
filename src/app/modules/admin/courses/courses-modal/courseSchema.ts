

export const courseFormFields=(catalogs: any)=> {
    
      return ([
    
        {
          type: 'column',
          columns: [
            {
              fields: [
                
                {
                  key: 'name',
                  label: 'Nombre',
                  type: 'text',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                {
                  key: 'level',
                  label: 'Nivel',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },
                },
                {
                  key: 'section',
                  label: 'Sección',
                  type: 'text',
                  validators: { required: true },

                },
                {
                  key: 'mainTeacherId',
                  label: 'Profesor',
                 type: 'select',
                  options: catalogs['teachers'],
                  validators: { required: true },
                },
              ],
              
            },
            
            
        
          ]
        },
       
      
      ]
    )
   }

 