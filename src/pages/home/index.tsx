// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'

const Home = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Admin start 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>All the best for your new project.</Typography>
            <Typography>
              <Translations text='Chat'/>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
