// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Editor from 'src/@core/editor/Editor';
import { blogService } from '../../../../src/@core/services/BlogService';

export default function CreatePost({ article }: { article: any }) {
  console.log('article:', article);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>This is your second page.</Typography>
            <Typography>
              Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. Carrot cake dragée chupa chups jujubes.
              Macaroon liquorice cookie wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={8}>
        <Card>
          <CardHeader title='Content' />
          <Editor article={article} />
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardHeader title='meta' />
        </Card>
      </Grid>
      <Grid></Grid>
    </Grid>
  );
}

export async function getStaticProps() {
  const articleRes = await blogService.getStory('PpXOPvOvsNvu5QFwe61j');
  const article = JSON.parse(JSON.stringify(articleRes));
  
  return {
    props: { article },
    revalidate: 180
  };
}
