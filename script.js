// 데이터 저장 (LocalStorage 사용)
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// 페이지 로드 시 기존 포스트 표시
document.addEventListener('DOMContentLoaded', () => {
    renderFeed();
});

// 사진 업로드 함수
function uploadImage() {
    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const file = imageInput.files[0];

    if (!file) {
        alert('사진을 선택해주세요.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const post = {
            id: Date.now(),
            image: e.target.result,
            caption: captionInput.value || '사진을 공유했습니다.',
            author: 'TFT 팀원',
            likes: 0,
            liked: false,
            comments: [],
            timestamp: new Date().toLocaleString('ko-KR')
        };

        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));

        // 입력 필드 초기화
        imageInput.value = '';
        captionInput.value = '';

        renderFeed();
    };

    reader.readAsDataURL(file);
}

// 피드 렌더링 함수
function renderFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    posts.forEach(post => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.innerHTML = `
            <div class="photo-header">
                <div class="photo-avatar">${post.author.charAt(0)}</div>
                <div>
                    <div class="photo-author">${post.author}</div>
                    <small style="color: #95a5a6;">${post.timestamp}</small>
                </div>
            </div>

            <img src="${post.image}" alt="사진" class="photo-image">

            <div class="photo-content">
                <div class="photo-caption">${post.caption}</div>

                <div class="photo-actions">
                    <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                        ❤️ 좋아요
                    </button>
                    <button class="action-btn" onclick="focusCommentInput(${post.id})">
                        💬 댓글
                    </button>
                </div>

                <div class="like-count" id="like-count-${post.id}">
                    ${post.likes > 0 ? `좋아요 ${post.likes}개` : ''}
                </div>

                <div class="comments-section">
                    <div id="comments-${post.id}">
                        ${post.comments.map((comment, index) => `
                            <div class="comment">
                                <div class="comment-author">${comment.author}</div>
                                <div class="comment-text">${comment.text}</div>
                                <button class="action-btn" style="font-size: 0.8rem;" onclick="deleteComment(${post.id}, ${index})">
                                    삭제
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="comment-input-area">
                        <input type="text" 
                               class="comment-input" 
                               id="comment-input-${post.id}"
                               placeholder="댓글을 입력하세요..."
                               onkeypress="handleCommentKeypress(event, ${post.id})">
                        <button class="comment-submit-btn" onclick="addComment(${post.id})">
                            전송
                        </button>
                    </div>
                </div>
            </div>
        `;

        feed.appendChild(photoCard);
    });

    if (posts.length === 0) {
        feed.innerHTML = '<p style="text-align: center; color: #95a5a6; margin-top: 2rem;">아직 게시된 사진이 없습니다. 첫 번째 사진을 공유해보세요!</p>';
    }
}

// 좋아요 토글 함수
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderFeed();
    }
}

// 댓글 추가 함수
function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('댓글을 입력해주세요.');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            author: 'TFT 팀원',
            text: commentText,
            timestamp: new Date().toLocaleString('ko-KR')
        });

        localStorage.setItem('posts', JSON.stringify(posts));
        commentInput.value = '';
        renderFeed();
    }
}

// 엔터 키로 댓글 전송
function handleCommentKeypress(event, postId) {
    if (event.key === 'Enter') {
        addComment(postId);
    }
}

// 댓글 포커스 함수
function focusCommentInput(postId) {
    document.getElementById(`comment-input-${postId}`).focus();
}

// 댓글 삭제 함수
function deleteComment(postId, commentIndex) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.splice(commentIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        renderFeed();
    }
}
