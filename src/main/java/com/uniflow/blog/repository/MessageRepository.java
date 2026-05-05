package com.uniflow.blog.repository;

import com.uniflow.blog.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m " +
           "WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) " +
           "   OR (m.sender.id = :u2 AND m.receiver.id = :u1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :uid THEN m.receiver.id ELSE m.sender.id END " +
           "FROM Message m WHERE m.sender.id = :uid OR m.receiver.id = :uid")
    List<Long> findContactIds(@Param("uid") Long userId);

    @Query("SELECT m FROM Message m " +
           "WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) " +
           "   OR (m.sender.id = :u2 AND m.receiver.id = :u1) " +
           "ORDER BY m.createdAt DESC LIMIT 1")
    Optional<Message> findLastMessage(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.receiver.id = :uid AND m.sender.id = :sid AND m.read = false")
    long countUnread(@Param("uid") Long userId, @Param("sid") Long senderId);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.read = true " +
           "WHERE m.receiver.id = :uid AND m.sender.id = :sid AND m.read = false")
    void markAsRead(@Param("uid") Long userId, @Param("sid") Long senderId);
}
