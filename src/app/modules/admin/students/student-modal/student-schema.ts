

export const studentFormFields=(catalogs: any)=> {
    
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
                  label: 'Apellido paterno',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },
                },
                {
                  key: 'middleName',
                  label: 'Apellido materno',
                  type: 'text',
                  validators: { required: true, maxLength: 100, minLength: 0 },

                },
                {
                  key: 'identityCard',
                  label: 'Carnet identidad',
                  type: 'text',
                 validators: { required: true, maxLength: 100, minLength: 0 },

                },
                {
                  key: 'birthDate',
                  label: 'Fecha de nacimiento',
                  type: 'datetime',
                  validators: { required: true },
                  format: "YYYY-MM-DD HH:mm:ss.SSS",
                  

                },
                {
                  key: 'firstNameTutor',
                  label: 'Nombre tutor',
                  type: 'text',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                {
                  key: 'lastNameTutor',
                  label: 'Apellidos tutor',
                  type: 'text',
                  validators: { required: true, maxLength: 50, minLength: 0 },
                },
                {
                  key: 'phoneTutor',
                  label: 'Celular tutor',
                  type: 'text',
                  validators: { required: true, maxLength: 10, minLength: 0 },

                },
                {
                  key: 'address',
                  label: 'Dirección',
                  type: 'text',
                 validators: { required: true, maxLength: 100, minLength: 0 },

                },
              
              ],
              
            },
            
            
        
          ]
        },
       
      
      ]
    )
   }

 