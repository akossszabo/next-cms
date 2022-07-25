// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'Blog',
      icon: PencilOutline,
      children: [
        {
          title: 'Posts',
          path: '/blog/posts',
        },
        {
          title: 'Create',
          path: '/blog/create'
        }
      ]
    },
  ]
}

export default navigation
