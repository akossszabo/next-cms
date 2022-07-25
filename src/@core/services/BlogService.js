import {
  query,
  orderBy,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { firedb, fireStorage } from "../../configs/firebase";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

class BlogService {
  constructor() {
    console.log("BlogService initialized");
    dayjs.extend(timezone);
    dayjs.tz.setDefault(dayjs.tz.guess());
  }

  async getStories() {
    console.log("StoriesService - getStories()");
    const draft = [];
    const published = [];
    try {
      const docs = await getDocs(
        query(collection(firedb, "stories"), orderBy("updated", "desc"))
      );
      console.log("size: ", docs.size);
      docs.forEach((doc) => {
        var data = doc.data();
        if (data && data.title) {
          var updated = dayjs(data.updated.seconds * 1000)
            .format("HH:mm, YYYY-MM-DD")
            .toString();
          if (data.state === 1) {
            draft.push({ id: doc.id, title: data.title, lastEdited: updated });
          } else if (data.state === 2) {
            published.push({ id: doc.id, title: data.title, lastEdited: updated });
          }
        }
      });
    } catch (e) {
      console.error("Error getting stories: ", e);
    }
    return { draft: draft, published: published };
  }

  async getStory(id) {
    console.log("StoriesService - getStory() - " + id);
    try {
      const document = await getDoc(doc(firedb, "stories", id));
      if (document.exists()) {
        return document.data();
      }
    } catch (e) {
      console.error("Error getting story: ", e);
    }
    return null;
  }

  async uploadFile(file) {
  /*console.log('storage: ', fireStorage);
    const storageRef = ref(fireStorage, new Date().toLocaleDateString('sv-SE') + '/' + file.name);
    const upload = await uploadBytes(storageRef, file)
    //.then(async snapshot => {
    const url = await getDownloadURL(storageRef);
    console.log('url: ', url);
    //});*/


  }

  async createStory(title, content) {
    console.log("StoriesService - createStory() - " + title);
    try {
      var now = dayjs().toDate();
      const docRef = await addDoc(collection(firedb, "stories"), {
        title: title,
        state: 1,
        created: now,
        updated: now,
        published: null,
        content: content,
      });
      console.log("Story saved with id: ", docRef.id);
      return await this.getStory(docRef.id);
    } catch (e) {
      console.error("Error saving story: ", e);
    }
    return null;
  }

  async updateStory(id, story) {
    console.log("StoriesService - updateStory() - " + id);
    try {
      story.updated = dayjs().toDate();
      await updateDoc(doc(firedb, "stories", id), story);
    } catch (e) {
      console.error("Error updating story: ", e);
    }
  }

  async publishStory(id) {
    console.log("StoriesService - publishStory() - " + id);
    try {
      var now = dayjs().toDate();
      await updateDoc(doc(firedb, "stories", id), {
        state: 2,
        published: now,
      });
    } catch (e) {
      console.error("Error publishing story: ", e);
    }
  }

  async unpublishStory(id) {
    console.log("StoriesService - unpublishStory() - " + id);
    try {
      await updateDoc(doc(firedb, "stories", id), {
        state: 1,
        published: null,
      });
    } catch (e) {
      console.error("Error unpublishing story: ", e);
    }
  }

  async deleteStory(id) {
    console.log("StoriesService - deleteStory() - " + id);
    try {
      await deleteDoc(doc(firedb, "stories", id));
    } catch (e) {
      console.error("Error deleting story: ", e);
    }
  }
}

export const blogService = new BlogService();