package com.djenidi.ai_mentor.dto.response;

import java.util.List;

public class UserDto {

    private Long        id;
    private String      email;
    private String      username;
    private String      avatarUrl;
    private int         points;
    private boolean     isPremium;
    private String      role;
    private List<String> roles;

    public UserDto() {}

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserDto obj = new UserDto();
        public Builder id(Long v)            { obj.id = v;        return this; }
        public Builder email(String v)       { obj.email = v;     return this; }
        public Builder username(String v)    { obj.username = v;  return this; }
        public Builder avatarUrl(String v)   { obj.avatarUrl = v; return this; }
        public Builder points(int v)         { obj.points = v;    return this; }
        public Builder isPremium(boolean v)  { obj.isPremium = v; return this; }
        public Builder role(String v)        { obj.role = v;      return this; }
        public Builder roles(List<String> v) { obj.roles = v;     return this; }
        public UserDto build()               { return obj; }
    }

    // Getters
    public Long         getId()        { return id; }
    public String       getEmail()     { return email; }
    public String       getUsername()  { return username; }
    public String       getAvatarUrl() { return avatarUrl; }
    public int          getPoints()    { return points; }
    public boolean      isPremium()    { return isPremium; }
    public String       getRole()      { return role; }
    public List<String> getRoles()     { return roles; }
}
