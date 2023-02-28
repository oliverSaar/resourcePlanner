<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Imports -->
  <xsl:include href="res/date.xsl"/>
  <xsl:include href="res/functions.xsl"/>
  
  <!-- Root -->
  <xsl:template match="root">
    <div class="widget-container">
      <div class="widget-list">
        <xsl:call-template name="list-events">
        </xsl:call-template>
      </div>
      <div class="widget-list">
        <xsl:call-template name="list-habits">
        </xsl:call-template>
      </div>
    </div>
  </xsl:template>
  
  <!-- Events -->
  <xsl:template name="list-events">
    <xsl:variable name="todayDatetime">
      <xsl:call-template name="datetime-to-seconds">
        <xsl:with-param name="datetime" select="@datetime"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="todayDatetimeAdjusted">
      <xsl:call-template name="adjust-to-timezone">
        <xsl:with-param name="datetime" select="@datetime"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="todayDate">
      <xsl:value-of select="concat(substring($todayDatetimeAdjusted, 1, 4), '-',substring($todayDatetimeAdjusted, 6, 2), '-', substring($todayDatetimeAdjusted, 9, 2))"/>
    </xsl:variable>
    
    <h1>Anstehende Termine</h1>
    
    <xsl:for-each select="events/*">
      <xsl:variable name="startSeconds">
        <xsl:call-template name="datetime-to-seconds">
          <xsl:with-param name="datetime" select="./start"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="startDatetime">
        <xsl:call-template name="adjust-to-timezone">
          <xsl:with-param name="datetime" select="./start"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="startDate">
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="$startDatetime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endSeconds">
        <xsl:call-template name="datetime-to-seconds">
          <xsl:with-param name="datetime" select="./end"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endDatetime">
        <xsl:call-template name="adjust-to-timezone">
          <xsl:with-param name="datetime" select="./end"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endDate">
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="$endDatetime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:if test="($todayDatetime &gt;= $startSeconds and $endSeconds &gt;= $todayDatetime) or contains($startDatetime, $todayDate) or contains($endDatetime, $todayDate)">
        <!-- Widget -->
        <div class="app-card">
          <xsl:call-template name="title"/>
          
          <xsl:call-template name="event-timestamp">
            <xsl:with-param name="date-stamp" select="not($startDate = $endDate)"/>
          </xsl:call-template>
          
          <xsl:call-template name="description"/>
          
          <xsl:call-template name="widget-actions">
            <xsl:with-param name="href" select="'calendar'"/>
          </xsl:call-template>
        </div>
      </xsl:if>
    </xsl:for-each>
    
    <span class="undefined-description">Keine Termine für heute</span>
    
  </xsl:template>
  
  <!-- Event-Time-Stamp -->
  <xsl:template name="event-timestamp">
    <xsl:param name="date-stamp" select="false"/>
    
    <p class="event-time">
      <xsl:if test="$date-stamp">        
        Start:
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="./start"/>
        </xsl:call-template>
        
        |
        
        Ende:
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="./end"/>
        </xsl:call-template>
        
        <br/>
      </xsl:if>
      von:
      <xsl:call-template name="format-to-time">
        <xsl:with-param name="iso-datetime" select="./start"/>
      </xsl:call-template>
      
      bis:
      <xsl:call-template name="format-to-time">
        <xsl:with-param name="iso-datetime" select="./end"/>
      </xsl:call-template>
    </p>
  </xsl:template>
  
  <!-- Habits -->
  <xsl:template name="list-habits">
    <xsl:variable name="todayDatetime">
      <xsl:call-template name="datetime-to-seconds">
        <xsl:with-param name="datetime" select="@datetime"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="todayDatetimeAdjusted">
      <xsl:call-template name="adjust-to-timezone">
        <xsl:with-param name="datetime" select="@datetime"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="todayDate">
      <xsl:value-of select="concat(substring($todayDatetimeAdjusted, 1, 4), '-',substring($todayDatetimeAdjusted, 6, 2), '-', substring($todayDatetimeAdjusted, 9, 2))"/>
    </xsl:variable>
    
    <h1>Aktive Gewohnheiten</h1>
    
    <xsl:for-each select="habits/*">
      <xsl:variable name="startSeconds">
        <xsl:call-template name="datetime-to-seconds">
          <xsl:with-param name="datetime" select="./start"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="startDatetime">
        <xsl:call-template name="adjust-to-timezone">
          <xsl:with-param name="datetime" select="./start"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="startDate">
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="$startDatetime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endTime">
        <xsl:choose>
          <!-- Date -->
          <xsl:when test="./repeat/repeating[@type='date']">
            <xsl:call-template name="adjust-to-timezone">
              <xsl:with-param name="datetime" select="./repeat/repeating"/>
            </xsl:call-template>
          </xsl:when>
          <!-- Weeks -->
          <xsl:otherwise>
            <xsl:variable name="tempEndDatetime">
              <xsl:call-template name="adjust-to-timezone">
                <xsl:with-param name="datetime" select="./end"/>
              </xsl:call-template>
            </xsl:variable>
            <xsl:call-template name="datetime-add-weeks">
              <xsl:with-param name="datetime" select="$tempEndDatetime"/>
              <xsl:with-param name="weeks" select="./repeat/repeating"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      
      <xsl:variable name="endSeconds">
        <xsl:call-template name="datetime-to-seconds">
          <xsl:with-param name="datetime" select="$endTime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endDatetime">
        <xsl:call-template name="adjust-to-timezone">
          <xsl:with-param name="datetime" select="$endTime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="endDate">
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="$endDatetime"/>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:if test="($todayDatetime &gt;= $startSeconds and $endSeconds &gt;= $todayDatetime) or contains($startDatetime, $todayDate) or contains($endDatetime, $todayDate)">
        <!-- Widget -->
        <div class="app-card">
          <xsl:call-template name="title"/>
          
          <xsl:call-template name="habit-timestamp"/>
          
          <xsl:call-template name="description"/>
          
          <xsl:call-template name="repeat"/>
          
          <xsl:call-template name="alternate-list"/>
          
          <xsl:call-template name="widget-actions">
            <xsl:with-param name="href" select="'planner'"/>
          </xsl:call-template>
        </div>
      </xsl:if>
    </xsl:for-each>
    
    <span class="undefined-description">Keine Gewohnheiten angelegt</span>
  </xsl:template>
  
  <!-- Habit-Time-Stamp -->
  <xsl:template name="habit-timestamp">
    <p class="event-time">
      zwischen:
      <xsl:call-template name="format-to-time">
        <xsl:with-param name="iso-datetime" select="./start"/>
      </xsl:call-template>
      
      und:
      <xsl:call-template name="format-to-time">
        <xsl:with-param name="iso-datetime" select="./end"/>
      </xsl:call-template>
      
      |
      
      Dauer:
      <xsl:value-of select="./duration"/>
      Minuten
      
      <br/>
      
      Start:
      <xsl:call-template name="format-to-date">
        <xsl:with-param name="iso-datetime" select="./start"/>
      </xsl:call-template>
      
    </p>
  </xsl:template>
  
  <!-- Timespan -->
  <xsl:template name="timespan">
    <xsl:variable name="startDate">
      <xsl:call-template name="adjust-to-timezone">
        <xsl:with-param name="datetime" select="./start"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="endDate">
      <xsl:call-template name="adjust-to-timezone">
        <xsl:with-param name="datetime" select="./end"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="idealTimeDate">
      <xsl:call-template name="adjust-to-timezone">
        <xsl:with-param name="datetime" select="./idealTime"/>
      </xsl:call-template>
    </xsl:variable>
    
    <xsl:variable name="startHour" select="substring($startDate,12,2)"/>
    <xsl:variable name="startMinute" select="substring($startDate,15,2)"/>
    <xsl:variable name="start" select="$startHour * 60 + $startMinute"/>
    
    <xsl:variable name="endHour" select="substring($endDate,12,2)"/>
    <xsl:variable name="endMinute" select="substring($endDate,15,2)"/>
    <xsl:variable name="end" select="$endHour * 60 + $endMinute"/>
    
    <xsl:variable name="idealTimeHour" select="substring($idealTimeDate,12,2)"/>
    <xsl:variable name="idealTimeMinute" select="substring($idealTimeDate,15,2)"/>
    <xsl:variable name="idealTime" select="$idealTimeHour * 60 + $idealTimeMinute"/>
    
    <xsl:variable name="duration" select="./duration"/>
    <xsl:variable name="idealTimeEnd" select="$idealTime + $duration"/>
    
    <xsl:variable name="day" select="24 * 60"/>
    
    <div class="times-display">
      <div class="timespan-bar">
        <xsl:attribute name="style">
          width:
          <xsl:call-template name="to-percent">
            <xsl:with-param name="numerator" select="$end - $start"/>
            <xsl:with-param name="denominator" select="$day"/>
          </xsl:call-template>%;
          margin-left:
          <xsl:call-template name="to-percent">
            <xsl:with-param name="numerator" select="$start"/>
            <xsl:with-param name="denominator" select="$day"/>
          </xsl:call-template>%;
        </xsl:attribute>
        <div class="time-bar">
          <xsl:attribute name="style">
            width:
            <xsl:call-template name="to-percent">
              <xsl:with-param name="numerator" select="$idealTimeEnd - $idealTime"/>
              <xsl:with-param name="denominator" select="$end - $start"/>
            </xsl:call-template>%;
            margin-left:
            <xsl:call-template name="to-percent">
              <xsl:with-param name="numerator" select="$idealTime - $start"/>
              <xsl:with-param name="denominator" select="$end - $start"/>
            </xsl:call-template>%;
          </xsl:attribute>
          <div class="timestart-bar">
            <div class="timestart-text">
              <xsl:value-of select="$idealTimeHour"/>:<xsl:value-of select="$idealTimeMinute"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>
  
  <!-- Repeat -->
  <xsl:template name="repeat">
    <div class="repeat-section">
      <xsl:call-template name="timespan"/>
      <div class="repeat-display">
        <xsl:call-template name="day-list"/>
        <xsl:call-template name="repeat-description"/>
      </div>
    </div>
  </xsl:template>
  
  <!-- Repeat-Description -->
  <xsl:template name="repeat-description">
    <p>
      <xsl:if test="./repeat/repeating/@type='date'">
        Wiederholen bis:
        <xsl:call-template name="format-to-date">
          <xsl:with-param name="iso-datetime" select="./repeat/repeating"/>
        </xsl:call-template>
      </xsl:if>
      
      <xsl:if test="./repeat/repeating/@type='number'">
        Wiederholungen: <xsl:value-of select="./repeat/repeating"/> Woche(n)
      </xsl:if>
    </p>
  </xsl:template>
  
  <!-- Day-List -->
  <xsl:template name="day-list">
    <div class="day-list app-border">
      <span >
        <xsl:if test="repeat/days/*=1">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Mo
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=2">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Di
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=3">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Mi
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=4">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Do
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=5">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Fr
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=6">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        Sa
      </span>
      
      <span>
        <xsl:if test="repeat/days/*=0">
          <xsl:attribute name="class">active-day</xsl:attribute>
        </xsl:if>
        So
      </span>
    </div>
  </xsl:template>
  
  <!-- Alternate-Habits -->
  <xsl:template name="alternate-list">
    <div class="mat-expansion-panel alternate-habit-list">
      <!-- Header -->
      <div class="mat-expansion-panel-header mat-focus-indicator">
        <xsl:attribute name="onclick">
          window.dispatchEvent(new CustomEvent('toggle-expand-habits', {'detail': this}));
        </xsl:attribute>
        <span class="mat-content">
          Alternative Zeiten
        </span>
        <button class="mat-focus-indicator mat-icon-button mat-button-base">
          <span class="mat-button-wrapper">
            <mat-icon role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">
              navigate_before
            </mat-icon>
          </span>
          <span class="mat-button-focus-overlay"></span>
        </button>
      </div>
      <!-- Content -->
      <div class="mat-expansion-panel-body minimized">
        <xsl:call-template name="alternate-items"/>
      </div>
    </div>
  </xsl:template>
  
  <!-- Alternate-Habit -->
  <xsl:template name="alternate-items">
    <xsl:if test="count(./alternateEvents/*) = 0">
      <span class="undefined-description">Keine alternativen Zeiten vorhanden</span>
    </xsl:if>
    <xsl:for-each select="./alternateEvents/*">
      <div class="alternate-item app-border">
        <span>
          <xsl:variable name="isProblem" select="./problem"/>
          
          <xsl:attribute name="class">
            <xsl:if test="$isProblem">
              warn-text
            </xsl:if>
          </xsl:attribute>
          
          <xsl:call-template name="format-to-date">
            <xsl:with-param name="iso-datetime" select="./start"/>
          </xsl:call-template>
          
          -
          
          <xsl:call-template name="format-to-time">
            <xsl:with-param name="iso-datetime" select="./start"/>
          </xsl:call-template>
          
          <xsl:if test="$isProblem">
            (Keine alternative Zeit möglich!)
          </xsl:if>
        </span>
      </div>
    </xsl:for-each>
  </xsl:template>
  
  <!-- Title -->
  <xsl:template name="title">
    <div class="color-label">
      <xsl:attribute name="style">background-color:<xsl:value-of select="./color/primary"/></xsl:attribute>
    </div>
    <h2><xsl:value-of select="./title"/></h2>
  </xsl:template>
  
  <!-- Description -->
  <xsl:template name="description">
    <p>
      <xsl:choose>
        <xsl:when test="not(./description)">
          <xsl:attribute name="class">undefined-description</xsl:attribute>
          - Keine Beschreibung -
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="./description"/>
        </xsl:otherwise>
      </xsl:choose>
    </p>
  </xsl:template>
  
  <!-- Actions -->
  <xsl:template name="widget-actions">
    <xsl:param name="href"/>
    <div class="widget-actions">
      <a class="mat-focus-indicator mat-stroked-button mat-button-base">
        <xsl:attribute name="href">#/<xsl:value-of select="$href"/></xsl:attribute>
        <span class="mat-button-wrapper">Anzeigen</span>
        <span class="mat-button-focus-overlay"></span>
      </a>
    </div>
  </xsl:template>
  
</xsl:stylesheet>
