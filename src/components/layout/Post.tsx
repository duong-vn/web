interface PostProps {
  post: EverythingInPost;
  curUser: number;
}

import Comments from "@/components/layout/Comments";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { GROUP_IMAGE, USER_IMAGE } from "../../app/utils/constants";
import { deleteReaction, getReactionsByPostId, isLikePost, postCreateReactionByPostId, deletePost } from "@/app/services/apiServices";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import ModalDeletePost from "./ModalDeletePost";
// const mockData = {
//      group_name:'Nhóm này là để testttttestttt',
//     group_image:'data:image/webp;base64,UklGRpoTAABXRUJQVlA4II4TAAAQTQCdASq5AHcAPl0Yl0ujqqOjlQFQC4ljAMWEQxS8tvk/ypko4kXd2c38d3ufRpuMO9A95zTj96p/zdAp6ew7bjOyj/heAPACexuUX4fm3x3f+Dw0fw3/F9gDylP+HyVfvvqJ9LT94/aA/XZeC753lk4LRfSD1s5ZqHA9WxXsw/p1GshpbHOmkhYUdEc9NXj4lhHxFqAJ4TnfqJAt/QrgOtr+ablW/HEmoToFVTy4CtvEIfVujK40sDwKtzyDTMZ2774Nl/iG2GoR2tK7LXhI+8TBoGL6kdqUHhHIMRCIHG1K6bpfizIOaj83VfCh/xRBh3fbmcqm98QQWExGbj5ba3JZrWZUBpqhTSf7BUsWQGchAhr/uOLzbnwPgowvVPeY7XdGYasP+W8r860svdw6+o5fu/UXI9lZQ5Nlga1nxbZVp5MG3P5WU84lOXSnAjL095PC2kfYoOh0F/5W10c3WqkIAX9SJAoQGA/pO/max0nCQjqa3PsJFy0VfFZecTrcK2gA8yPbgjiTfB4MAD0VksbfKJuFmKgBCgpa98THVE09hyzQvRZksImb0RyJoiCIr/vGfGbreGqeGCTdMydhDc3rreCvfSZUT2Wf3OOX8qF16JOJ7pB5TJUrRmHH/nrvTnY04Lm1HD9YBFgw3ETta9fJ8JpJZ1RNTo13lC/8jaz5ZoFj1dhjXFx/xEUVR2rE78kZOM27PL4Hntw+InKpVP3Xj+rvGMFVKubsqsnQQ05/MCIIhF6UeqSryS+dWBNEsrtwWKfmHdG9pTCWqna3wHKbXE0IEeeDeehLVgJ5FoMthYRIpplzx18OOs9eU5j4AP79/dp98rVPkJUCSqXm9mJrZf7tI3gQcRwfEQTDRKtBHvFnvdHFshDgeKeiCgn8URwd9MvDehQoRNTkLQxlL6k3MKUnSQs8QcrPbJAk66m9qybXM4mvhUvOWX58OlfDi8qzkfGWXIPVgZbpJNl57Cp2b/ZbfFRneFvZCURGUZrRhbztdvsQkgCDvCdU7RCYoSaT+GPUmdORBO/rmuPvKSiJ4iYhZQISzB7AqvF+yQKQimtMo9/fdxLCJ4tu1ZpW16oCvvqpKwcv85WRyvOo4xnXEiC2RgXnommGv7kjdJeqsHAoBAI/hdMmLJ6rHoDl+3qp6FUlyASdFFGdY0kSm85Ju8J0Nf9KitTO0mfvIlPe7XcUlMNcEi8cKTKv+f8mCZUoP9/XOqB4Tl/WnDFjYGYTJV6+xA/QJQGewFPLoBQsNAIu5q8yJVxcugtFFhDnDUGFQO2eyh1IGxCaR5McOBM/96hhipCTQwaCATf1tvTy2ZUwCN7jxzG3ewpTiBUdDqjsYeE+kGLbOYSbyFkWJ9pg1qapcm5oN8Ec+BfktmuqOB05nyiQNtld7wM2JMNTx5NQCOht7mpYEwqr/Da2Onc5CIdWu7aHJgPdneiqjZkUL6kqQk6PAC43Wzh6Mgtoz3rY3Io7lpSJSTI9RLuw0DP2jAueaW2QjLkbXyIjX+QAFHPt0PTJwJshZ4mpg/Vil1f72I9Q0KiTcK8MSUfH7ubXJWiSuQqn3w09I+fagQUu6sqNV/WUdQDVcLWjuexvx1S5g5TdynqJXL3+GulTaEhsxtsr2FP4WSuds1DDnitHTeP8auaoK1StV0SrNCyOHBDBouXid3MvcPhaOyXBSyAIaB3vdVrLCRS4nYdJ6VaQK0PY1XVXCnvczZdbfuW/GjQoyOkS8HbKquFx9+bUG5ImDPP+BykUBJRFb9BgoBOSFCShJcgMQh1Odrk/jivdpw8Ckn4onR2sNyteYhoA6GAB4o0Xp2IzXsml276X484kmlSZbktD1j/2qcqZbwjQbGaz/4eNQd/Q6iLY7XlmRZq8JQ0MH77HBGkqIZRCpzZw+/hm1Bjt1A4+/lXKOK1pySdp1R01VWF+tSxo+F1yWfmCmMU7gI7ifrD2lNEmFytpmqBHOWsV3g5hwRE4WiAqyal33VG+MdnBSwh5Ji+qLO2Jdu3ORbHeozzsIQFFpBZ3etI7v0fa+0XmlOluy80TqTwYXj4mAZUJGTyP0HAfAEn1SQsVRmKBzFwedF2mOYv7Q5ikx84HKOS1kTBjw2QUCF5TNO4OLR6aYZ7dz5Tj+MzEuf/cC9Gdh2+tdmvQcWKWMObLm45X/J2oFpPuTPkkgaRW0Q9bR7gFy1p2y4TjzXhZ5OpHx/WBBG7/rE96ke827N+8qTLu7rOKWtTCw5DRRo9U2sA3zcTG+IWAyKfxysJsp9h29mNcKSnYeSSxWOzrW5P37DrW1gGnCg5vISElKLM+DVlRHvoaons+IrBmRLkLAb2rz+Wb4OEQY213AI/DGIyMsc4vFFBgJyyhEG2nClKV8tIQho0BQiOgIPDneEr0ds7PUSoxpAJ5oKjuvZ37MiLybnhAvT85CEN4+/cg8B013q2yqvhJOt1v5NlFBOoDHx6gNXuI8MF0RSKieoWuYR15KQ/tlz9JieQzccdF/qwDnhyGLfsEQrIugcOALlfvO14pQbktLUS4MG5lpY4haiDgBudxTlm5bTlNCnUGKHfsreUclSKgPj7rxKKuEGt3GRlwDPahQ0kcq44aTDpZcC/SZcTiA9elO24lUhxL2sAZzI+awsLn1l/AQ5Ykf/a/Fue3mXHAN0HEcMKF2At65w0AMGbVgMW0Eq/GUPUPgJ4/cdPNrJqNLRU7lAryttPYZcR7ru3FYygAe0nMH9GDyZtktkX6Fl/1J5UGWRnn/cpntpbt4JHSv7Xe1/hb36sFUPanoCPfstiPqsj9xcEOZZeX1Y9z4X+l+kJeL46d08nXxnDak3kzTmbBkkPT35vodCxdZ+CMGWirTtT9AIozX9f/DgrG9p28fyX218CU59nJ0b8eOs/SrOIWYI56BVXkAqbNUenrbElQ6jkVdO35RwmLxVmJcFWV5I78g6mnhH4j60GtszaCtm6KHvuIbav6049FzPtigy7zNBA694qwS0ZZgFXodLF+q8H/XTcZTuRd9/o9//1t+TSveuF2rdnfoN53/69QjKZqF+LNpefylvV/L/4gk8eeXoFG7ygcgzm/2Ie3SeWEoWkMTJgvjWZeT8dr+L9jZNnT+f+fk74Y0Y+K0Oxh8+pcdF4cyd0yfZ48NU/EcT/wblnniIS8FSu//sUn58u1W+DXFT9ltoUGoE9wo2WPjR/hNcRPu4v5QKW2Eu1+GaYVaS9ByUeYhMwdnrEQeV0MvPmwfAb0P4SB1P91Dg7/DVzK5SiKlaRPDXFPOtjgW0dHQTEezAyyfUXacUjyT4ZVL7nC0w9vtSPsZGVTqrMrKSvFofoiBqLZFL1h6J0z5DM9PojVQ9L4EJQaGRGwVKU7MRnbdNgwoW0d+tszy96GgjFZ+4Eq6GwYbitysbW8yBlR+q9LjVLjJySmZ1EeZhjhY5hUPxhsaHwQUKhO6K28TwX/5o6GtSIh2Qa0PX1F63blcuGXrZlBYtVMxlYG5bwlGj3oVChP8984PS/815aepqDEkdJQyUD3Ok+4ECmd+JT7DmCmg7OccV+HZyKMzSIH0UHHo55r3zOFPOwK5WsUDXs8NwUGRcN50hr3AP+qTVqzMEMypxDBQJd2jhKfKnHD6tKGAMap90Bw1BmIlHzVX5bz+rZ6wPrVXUIxrJ3f8TNAlioGVECgqVPzT3hbdO9syncHJF2bk1jufrO+6/go3H3n3jAtCnqhvDP29rGnRA0tTSEf6eHFeEA5c/lS8Qt9dtH5EcVbkO0gCxqinGB0OQDfee4Ywm5JjQXWZE05KjopnXcGWOTz5LkTfCTQF7IwwkNndLwRKaiK3yTzQJlUySMKp6o2Hqy8qwdVCvHABubJJ/zBfzKOZ5/+RXks+778Z2oAj9XXP6HnAyY+Xs7uHzJ6uHNxIBQZlimcGpzrHHQtQaxgkO3CVt+IIQ9yWMCP0CbE+I8Y9HLzem7GF4gO9/uwwKg/Bn9lkLDl1tZUOXK2OakfRA35O9BVoA+I0emLjxBrA0o3GKD8UdQr5Gz9tZkYeI3QF1TFY+MSU9HrpkW4LqCxlwxoVA5lOXq2Yrw1Ebzs2XP1aT/EiQUbY9eBY4NVzospLs3nzInyqy7MfJpdt+VDXrTlfMsPTA4RwdVj9hS43RWXItk4ddt6Rfk1etcMENtWzh/7JfhKEU/ZzjpK2U5aM/6xQDwf6FlN7rnZzczwZQZn5OdOqxbt7bOaVpzlt5PJiZYuqYCWegcWU4LiuUZKGlJSt0qNK+jBLvtMYB8v1znPvTmdAVS5dnMtBnATZEpmhfODNw+ho3z7pj9Y3oKhUKJwT9Zv2qwuEYzjR4YBS9/AgKpZ5+c2sRsd0U5cfOegSoIZJ+VN5QkJ4Lq9dv7ELZ6WirxswZr5AvfCy7L/BiNlLQH92jsuT4HOHKWEmO8h27wrcuBgFAx6f0s7NCS4TQ0fEVjazxtZgew75bGE9BouSPWc3oilTaWRwO2i46uZMPYParkyxxat6IGPdm4WyM1xvvwmp/rTfvl8u3NceUZ15WTGMwTf3NJj9H5b77Km3SVk8ze9BZiqUUPVvpSQ/8EyVQi+xcLqlmCmcDTGXM303CcMbx/rhH0RQAP6pHygijzBsMcfhOfUYkvjUwGEdri3D6XysVfz5b2kqZhkZr5Sv/FXC04XjCKtoIuJz0coZJmMjsvdlEDOdDwuRVHGcO4f/JAC6vV28rehQBhAs8x3Yf8ejJS5VhILPNkz+6MTv7LfL/JMPLvXnCPCw0o1hlTO9TTqDGHhfwxbHXHYE0Cv6Lw9EoqSvVy3mcCIEOktNIbBzRIyhd+v6UGkhnVxF38dP5uYnYySViYL+Rw4iZwIvvNeLSRbnynT6HiocQcSfPCKxdw+eN+fi/QR7Ye0wOaO8sTgzWMjo/Pl5YneknftKOps76Lqslg0xGhi/acQRaRBi4J2P/AKUQyQXrlEfso0OnbsakjpW1/KWcGQoGr8dScsFmzNpidLrbkdORCoq7qedkIfAl4ZHNkQ+38I/6dZ8PooQ126GFwVVq///XopQpcpx9SnwMEKUmS53t5BZQb909FRz+uUEIbE2w1YwgylzHSvxPgGbwPHaTPilpn3fPg9Yvy4/+nDnLMgLiAd2WKAnoJnBWjmtBs4VvI2ngWSwDO1Oz+tGsL6ewVRhHh9aabFrz8mVJKzviEKD7sbPBDMg1ElPj2jab2JIbXIN9v6uBTPWzfghVoFkYsv2qPxHAkJLG6fElWTKBUrGJBedCD/YNJ4NoM401vO+1M7r27ApTWeagzRUXxaAEa3doXtdO0m0QXast2N5lCOdnefoO07RrIS6brIcqt5Ruj3jw4INrUeRZBiMTlcJ3Eh6sMo8INFzyI1avxPDIIIvPKwCfSz38xEpkrHyC4CRLwCviDH2d73pDB0qROVD/6nHDluhAsf4SW9Z/kMWyt0IhY4+WY/ojyq8afknLNE5ZJMf+OrfrHGhBGide8owc1+g5OMNYIpIffhOe3MP3cTu/gxoOkrO96XWNynHMIoHb2xz058gzvoA9lL6l7mC/jEv/nHSPz9SCddwXhAS2BjMMg3VYLIHtB5c7x4ksYIO3/Z/u2MDxpIvmrDC/2o7dOOFOp5gzpfxU0QY3A/9bwYavzcvQXMDUGZgZQFxOsB8VF0vSaGqgCCNOmk6hnWiLpyojqRlyZR1zJrAbYIvHQH1dEhXZtJ/v7FyXXIlx11CNz4ubXOm2bDV1RqTX27skNuwB/2vcAYcmewmdbrq22hHSIWZ1SlwFEjFqYNPamXTCvtnpdslu+tG5quV69Gn3pHxEmc7Woya0Uss755k6SIoqdzkIAQ1RI561cG2KtT6c1Abhwg/Q/aqPVVl87gOlSIZXCmCKk7xBSOiNflChIhmg2UbN2NoEnjymXOtJvOuZrA8lNWkt0FaES9WrDBEdXLi9s9xU3BRApHbU8Jp3w+hLgao8YpB6Db9Gn4YcTWrH5ZV4y8yIouu4zOSB/+IKuxsIgQJiFtq2IRlREfGGD1Mp2S0gHVgQ9/UWtx007XsJXgRl+lVQ76hmhe6/+6fSAzgUHYaW7Aj4IcZphXgT30ual31Uefbxr9pOa0Gnsryb2DZB/AHLAM3qQVrtCAL/n+5p8FzfBkNj+Pg3Jx7zF+/fqAE7jSACmgoLkc4ogR6jjtVBJjTnn6ixs+AiDLSKISWdi9IrD01i1l3WyeoVfGBsdmt/VGSn/m5pmXYn4l5cmJugzm7XhAOG7Ap/jMtz1vFfpr3nt9moBJnLqgPglaZ8hBh2ZmNAj5+A6Xpzlj4iLzL8/mfnVmgP0mno88lzceNOefzNrrtUX6sKDjUhwJz3hK4O49TrRASaKWzQeUonfw+ibbTRBF3wsT4U0FBtAYiCPiC2lSeITRlofXAZP1BJjNpHo5b2npDJvOE4jWbHxssLrC3OrlxZlSHxaySAt56XjeOcGVE/+3NI9l1aADQihqtg5pE4trzKO+qWuAX9Q1IrgZlpAjwO9i7tpxsdv8bfAx/42MI5HTOcPVc5p2+0w5MfWQXkhJt4zoiOVIL4YH9bunQgDz6W/Svhn8o9yfYgSpujG+bEJ5x/qZ1JR1sZArVUFOzQU/Kkq3eMlosaEd1b7qFnru3town67wNArQ8h3MwBrLl0rVTsWw09yZlnAQVLbEM9Gmu/HUnYyTJgAAAA==',
//      username: 'duong',
//     post_id:1,
//      content: 'homg qua doiashdoihasiodhaosidhokasn dasdasjidaosidjoajwoid oawdin asoudga usdo absd uiabs ab',
//   created_at: '1-1-2025',
//   user_id:1,
//   group_id:2,
//    image:  'data:image/webp;base64,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',
//      privacy: null,

// }

const Post = ({ post, curUser }: PostProps) => {
  const data = { ...post };
  const router = useRouter();
  const [showComment, setShowComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ content: data.content });

  const fetchReactions = async () => {
    const res = await getReactionsByPostId(data.post_id);
    const responseData = await res.json();
    setLikeCount(responseData.likeCount);
  };
  const fetchReactionsForUser = async () => {
   
    const res = await isLikePost(data.post_id,curUser)
    const likeData = await res.json();
    console.log('like data from post',likeData);
    setIsLiked(likeData);
  }

  useEffect(() => {
    fetchReactions();
    fetchReactionsForUser();
  }, []);
  const handleUnLike  = async () => {
    await deleteReaction(curUser,data.post_id)
   fetchReactions();
   setIsLiked(!isLiked);
   console.log("gorup name and post shi >>>", data,'>>>')

  };

  const handleLike = async () => {
    if(!curUser){
      toast.error("You need to be signed in in order to react")
      return;
    }
    await postCreateReactionByPostId(curUser,data.post_id)
   
   fetchReactions();
   setIsLiked(!isLiked);

  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDeletePost = async () => {
    if (!curUser) {
      toast.error("You need to be signed in to delete posts");
      return;
    }
    
    if (curUser !== data.user_id) {
      toast.error("You can only delete your own posts");
      return;
    }

    try {
      const res = await deletePost(data.post_id);
      if (res.ok) {
        toast.success("Post deleted successfully");
        setShowDeleteModal(false);
        // Refresh the posts list
        mutate(`/api/posts?user_id=${curUser}`);
        mutate(`/api/posts/group/${data.group_id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={(data.image?.length === 0 || !data.image)? GROUP_IMAGE :data.image }
              alt={data.group_name}
              className="h-14 w-14 object-cover rounded-xl ring-2 ring-gray-700 hover:ring-indigo-500 transition-all duration-300"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span onClick={()=>{
                  if(curUser == 0 ){
                    toast.error('You need to sign up before viewing content');
                    router.push('/auth/login');
                  }else{router.push(`/groups/${data.group_id}`)}
                }}
                className="text-lg font-bold text-gray-100 cursor-pointer hover:text-indigo-400 transition-colors duration-200">
                  {data.group_name}
                </span>
                
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={data.user_image ?? USER_IMAGE}
                    alt={data.username}
                    className="h-5 w-5 object-cover rounded-full ring-1 ring-gray-600"
                  />
                  <span className="font-medium text-gray-300 cursor-pointer hover:text-indigo-400" 
                  onClick={()=>{
                    if(curUser == 0 ){
                      toast.error('You need to sign up before viewing content');
                      router.push('/auth/login');
                    }else{
                    router.push(`/users/${data.user_id}`)
                  }
                    }}>{data.username}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{new Date(data.created_at).toLocaleDateString()}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center text-gray-400">
                    {data.privacy?.toLowerCase() === "public" ? (
                      <MdOutlinePublic className="w-4 h-4" />
                    ) : (
                      <RiGitRepositoryPrivateFill className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </div>
              {curUser === data.user_id && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-6">
          <p className="text-gray-300 whitespace-pre-wrap break-words text-lg leading-relaxed">
            {data.content}
          </p>
        </div>

        {/* Post Image */}
        {(data.image != null ) && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <img 
                src={data.image}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg hover:scale-[1.02] transition-transform duration-300" 
                alt="Post content"
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Interaction Section */}
        <div className="flex flex-row gap-6 mb-4">
          <div className="flex flex-row items-center gap-2"> 
            {isLiked ? (
              <button
                onClick={handleUnLike}
                className="group flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 bg-pink-900/50 hover:bg-pink-900/70"
              >
                <HeartSolid className="h-6 w-6 text-pink-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-pink-400 font-semibold">{likeCount}</span>
              </button>
            ) : (
              <button
                onClick={handleLike}
                className="group flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 bg-gray-700/50 hover:bg-gray-700/70"
              >
                <HeartOutline className="h-6 w-6 text-gray-400 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300" />
                <span className="text-gray-400 font-semibold">{likeCount}</span>
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowComment(!showComment)}
            className="group flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 bg-gray-700/50 hover:bg-gray-700/70"
          >
            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
            <span className="text-gray-400 font-semibold group-hover:text-blue-500">Comment</span>
          </button>
        </div>
          {showComment &&
        <Comments post_id={data.post_id} curUser={curUser} showComment={showComment} />}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">Edit Post</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
               
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={editData.content}
                    onChange={(e) =>
                      setEditData({ ...editData, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ModalDeletePost
            show={showDeleteModal}
            setShow={setShowDeleteModal}
            onConfirm={handleDeletePost}
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
          />
        )}
      </div>
    </div>
  );
};

export default Post;
